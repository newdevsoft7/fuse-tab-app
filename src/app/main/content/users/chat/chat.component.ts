import { Component, ViewChild, OnDestroy, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UsersChatService } from './chat.service';
import { UserService } from '../user.service';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { FuseChatViewComponent } from './chat-view/chat-view.component';
import { SocketService } from '../../../../shared/services/socket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipWhile';
import { FavicoService } from '../../../../shared/services/favico.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { NewThreadFormDialogComponent, AddUserFormDialogComponent, RenameThreadFormDialogComponent } from './dialogs';
import { ActivityManagerService } from '../../../../shared/services/activity-manager.service';
import { TabService } from '../../../tab/tab.service';
import { FCMService } from '../../../../shared/services/fcm.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class UsersChatComponent implements OnInit, OnDestroy {

  @ViewChild(FuseChatViewComponent) chatView: FuseChatViewComponent;
  content: string;
  selectedChat: any;
  selectedThread: any;
  users: any = [];
  threads: any = [];
  dialogRef: MatDialogRef<NewThreadFormDialogComponent>;
  userDialogRef: MatDialogRef<AddUserFormDialogComponent>;
  renameThreadDialogRef: MatDialogRef<RenameThreadFormDialogComponent>;
  alive: boolean = false;
  socketService: SocketService;
  fcmService: FCMService;

  messageSubscription: Subscription;
  activitySubscription: Subscription;
  tabSubscription: Subscription;
  socketSubscription: Subscription;

  pendingMessages: any = {};
  typingUsers: number[] = [];

  socketTimer: any;
  paginationDisabled: boolean = false;

  constructor(
    private tabService: TabService,
    private usersChatService: UsersChatService, 
    private userService: UserService, 
    private tokenStorage: TokenStorage, 
    private injector: Injector,
    private favicoService: FavicoService,
    private activityManagerService: ActivityManagerService,
    private dialog: MatDialog,
    private toastr: ToastrService) {

    this.socketService = injector.get(SocketService);
    this.fcmService = injector.get(FCMService);
    this.fetchThreads();
    this.watchActivityChange();
    this.watchTabChange();    
    this.listenIncomingMessages();
  }

  ngOnInit() {
    this.alive = true;

    if (!this.fcmService.notificationAllowed) {
      setTimeout(() => this.toastr.warning('Notification is not allowed for this domain.'));      
    }

    this.socketSubscription = this.socketService.connectionStatus.subscribe((connected: boolean) => {
      if (!connected) {
        this.socketTimer = setInterval(() => {
          this.toastr.warning('Chat server is not connected yet. Connecting now...');
        }, 10000);
      } else {
        if (this.socketTimer) {
          clearInterval(this.socketTimer);
          this.socketTimer = null;
        }
      }
    });
  }

  listenIncomingMessages() {
    this.messageSubscription = this.usersChatService.currentMessage.skipWhile(() => !this.alive).subscribe(async res => {
      if (!res || !res.type) return;
      switch (res.type) {
        case 'newMessage':
          if (!this.selectedThread) {
            if (this.activityManagerService.isFocused) {
              this.usersChatService.unreadList.push(res.data);
              this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
            }
            return;
          }
          if (parseInt(res.data.thread_id) === this.selectedThread.id) {
            res.data.seen_by_ids = [res.data.sender_id];
            res.data.ppic_a = this.selectedThread.participants.find(user => user.id === res.data.sender_id).ppic_a;
            this.selectedChat.push(res.data);
            this.chatView.readyToReply();
            if (this.activityManagerService.isFocused) {
              this.updateRead();
              this.updateReadStatus(this.selectedThread.id);
            }
          } else {
            if (this.activityManagerService.isFocused) {
              this.usersChatService.unreadList.push(res.data);
              this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
            }
          }
          break;
        case 'newThread':
          if (this.activityManagerService.isFocused) {
            this.usersChatService.unreadThreads.push(parseInt(res.data));
            this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
          }
          await this.fetchThreads();
          if (this.selectedThread && this.selectedThread.id === parseInt(res.data)) {
            this.selectedThread = this.threads.find(thread => thread.id === parseInt(res.data));
          }
          break;
        case 'typing':
          if (this.selectedThread && res.data.thread === this.selectedThread.id) {
            const index = this.typingUsers.indexOf(res.data.user);
            if (res.data.status) {
              if (index === -1) {
                this.typingUsers.push(res.data.user);
              }
            } else {
              if (index !== -1) {
                this.typingUsers.splice(index, 1);
              }
            }
          }
          break;
        case 'readThread':
          if (this.selectedThread && res.data.thread === this.selectedThread.id) {
            this.selectedChat.forEach(message => {
              if (message.seen_by_ids.indexOf(res.data.reader) === -1) {
                message.seen_by_ids.push(res.data.reader);
              }
            });
          }
          break;
        case 'renameThread':
          const changedThread = this.threads.find(thread => thread.id === res.data.thread);
          if (changedThread) {
            changedThread.name = res.data.name;
          }
          break;
        case 'removeUser':
          const index = this.threads.findIndex(thread => thread.id === res.data.thread);
          if (index !== -1) {
            if (this.tokenStorage.getUser().id === res.data.user) {
              this.threads.splice(index, 1);
              if (this.selectedThread && this.selectedThread.id === res.data.thread) {
                this.selectedThread = null;
                this.selectedChat = null
              }
            } else {
              await this.fetchThreads();
              if (this.selectedThread && this.selectedThread.id === res.data.thread) {
                this.selectedThread = this.threads[index];
              }
            }
          }
          break;
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
    this.messageSubscription.unsubscribe();
    this.activitySubscription.unsubscribe();
    this.tabSubscription.unsubscribe();
    this.socketSubscription.unsubscribe();
    this.selectedThread = null;
    this.selectedChat = null;
  }

  async fetchThreads() {
    try {
      this.threads = await this.usersChatService.getThreads();
    } catch (e) {
      this.handleError(e);
    }
  }

  updatePendingMessage(message: string) {
    if (!this.selectedThread) return;
    this.pendingMessages[this.selectedThread.id] = message;
  }

  updateTypingStatus(isTyping: boolean) {
    this.socketService.sendData({
      type: 'typing',
      payload: {
        status: isTyping,
        user: this.tokenStorage.getUser().id,
        thread: this.selectedThread.id,
        receipts: this.selectedThread.participants.map(user => user.id).filter(id => id !== this.tokenStorage.getUser().id)
      }
    });
  }

  watchActivityChange() {
    this.activitySubscription = this.activityManagerService.focusWatcher.skipWhile(() => !this.alive).subscribe((active: boolean) => {
      if (active && this.tabService.currentTab.url === 'users/chat' && this.selectedThread) {
        if (this.usersChatService.unreadList.length > 0) {
          this.updateRead();
        }
        this.updateReadStatus(this.selectedThread.id);
        this.readThread(this.selectedThread.id);
      }
    });
  }

  watchTabChange() {
    this.tabSubscription = this.tabService.tabActived.skipWhile(() => !this.alive).subscribe(activeTab => {
      if (activeTab.url === 'users/chat' && this.selectedThread) {
        if (this.usersChatService.unreadList.length > 0) {
          const unreads = this.usersChatService.unreadList.filter(message => message.thread_id === this.selectedThread.id);
          this.selectedChat = [...this.selectedChat, ...unreads];
          this.chatView.readyToReply();
          this.updateReadStatus(this.selectedThread.id);
          this.updateRead();
        }
        this.readThread(this.selectedThread.id);
      }
    });
  }

  async fetchChatByThread(threadId: number) {
    if (this.selectedThread && this.selectedThread.id === threadId) return;
    this.typingUsers = [];
    this.paginationDisabled = false;
    this.readThread(threadId);
    this.selectedChat = [];
    try {
      this.selectedChat = await this.usersChatService.getMessagesByThread(threadId, 0);
      this.selectedThread = this.threads.find(thread => thread.id === threadId);
      this.updateReadStatus(threadId);
      this.updateRead();
    } catch (e) {
      this.handleError(e);
    }
  }

  async fetchMessages(page: number) {
    try {
      const newMessages = await this.usersChatService.getMessagesByThread(this.selectedThread.id, page);
      if (newMessages.length > 0) {
        this.selectedChat = [...newMessages, ...this.selectedChat];
        this.chatView.directiveScroll.scrollToY(100);
      } else {
        this.paginationDisabled = true;
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  async sendMessage(message: any) {
    message.sender_id = this.tokenStorage.getUser().id;
    message.ppic_a = this.selectedThread.participants.find(user => user.id === message.sender_id).ppic_a;
    this.selectedChat.push(message);
    this.chatView.replyForm.reset();
    this.chatView.readyToReply();
    try {
      const savedMessage = await this.usersChatService.sendMessage(message);
      this.socketService.sendData({
        type: 'message',
        payload: {
          receipts: this.selectedThread.participants.map(user => user.id).filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id)),
          sender: this.tokenStorage.getUser().id,
          content: savedMessage
        }
      });
      message.id = savedMessage.id;
      message.created_at = savedMessage.created_at;
      message.updated_at = savedMessage.updated_at;
      message.seen_by_ids = [];
    } catch (e) {
      this.handleError(e);
    }
  }

  readThread(threadId: number) {
    const index = this.usersChatService.unreadThreads.indexOf(threadId);
    if (index > -1) {
      this.usersChatService.unreadThreads.splice(index, 1);
      this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
    }
  }

  updateRead() {
    for (let i = this.usersChatService.unreadList.length - 1; i >= 0; i--) {
      const threadId = this.usersChatService.unreadList[i].thread_id;
      if (this.selectedThread.id === threadId) {
        this.usersChatService.unreadList.splice(i, 1);
      }
    }
    this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
  }

  async updateReadStatus(threadId: number) {
    try {
      const receipts = this.selectedThread.participants.map(user => user.id).filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id));
      await this.usersChatService.updateReadStatus(threadId);
      if (this.selectedThread) {
        this.selectedThread.unread = 0;
      }
      this.socketService.sendData({
        type: 'readThread',
        payload: {
          thread: threadId,
          receipts: receipts,
          reader: this.tokenStorage.getUser().id
        }
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  async searchUsers(data: {searchText: string, type: string}) {
    if (!data.searchText) return;
    // this.users = [];
    try {
      this.users = await this.usersChatService.searchRecipient(data.searchText, data.type);
    } catch (e) {
      this.handleError(e);
    }
  }

  addContact(userId: number) {    
    this.dialogRef = this.dialog.open(NewThreadFormDialogComponent, {
      panelClass: 'thread-form-dialog'
    });
    this.dialogRef.afterClosed().subscribe(async message => {
      if (!message) {
        return;
      }
      try {
        const payload = await this.usersChatService.sendMessage({
          recipient_id: userId,
          content: message
        });
        this.threads = await this.usersChatService.getThreads();
        await this.fetchChatByThread(payload.thread_id);
        this.socketService.sendData({
          type: 'thread',
          payload: {
            thread: payload.thread_id,
            receipt: this.selectedThread.participants.map(user => user.id).filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id))
          }
        });
      } catch (e) {
        this.handleError(e);
      }
    });
  }

  triggerAddUserModal() {
    this.userDialogRef = this.dialog.open(AddUserFormDialogComponent, {
      panelClass: 'add-user-form-dialog',
      data: {
        thread_id: this.selectedThread.id,
        users: this.selectedThread.participants.map(user => user.id)
      }
    });
    this.userDialogRef.afterClosed().subscribe(async selectedUsers => {
      if (!selectedUsers) {
        return;
      }
      try {
        const threadId = this.selectedThread.id;
        const promiseList = [];
        selectedUsers.forEach(async (user: any) => {
          promiseList.push(this.usersChatService.addUserIntoThread(this.selectedThread.id, user.id));
        });
        await Promise.all(promiseList);
        await this.fetchThreads();
        this.selectedThread = this.threads.find(thread => thread.id === threadId);
        this.socketService.sendData({
          type: 'thread',
          payload: {
            thread: this.selectedThread.id,
            receipt: this.selectedThread.participants.map(user => user.id).filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id))
          }
        });
      } catch (e) {
        this.handleError(e);
      }
    });
  }

  triggerRenameThreadModal(name: string) {
    this.renameThreadDialogRef = this.dialog.open(RenameThreadFormDialogComponent, {
      panelClass: 'rename-thread-form-dialog',
      data: name
    });
    this.renameThreadDialogRef.afterClosed().subscribe(async name => {
      if (!name) {
        return;
      }
      try {
        const thread = this.selectedThread.id;
        const receipt = this.selectedThread.participants.map(user => user.id).filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id));
        await this.usersChatService.renameThread(thread, name);
        if (this.selectedThread) {
          this.selectedThread.name = name;
        }
        this.socketService.sendData({
          type: 'renameThread',
          payload: {
            thread,
            name,
            receipt
          }
        });
      } catch (e) {
        this.handleError(e);
      }
    });
  }

  async removeUser(userId: number) {
    try {
      const threadId = this.selectedThread.id;
      const receipt = this.selectedThread.participants.map(user => user.id).filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id));
      await this.usersChatService.removeUserFromThread(threadId, userId);
      await this.fetchThreads();
      this.selectedThread = this.threads.find(thread => thread.id === threadId);
      this.socketService.sendData({
        type: 'removeUser',
        payload: {
          thread: threadId,
          userId,
          receipt
        }
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(e) {
    this.toastr.error(e.error.message);
  }
}
