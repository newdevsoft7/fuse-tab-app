import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
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
import { NewThreadFormDialogComponent, AddUserFormDialogComponent } from './dialogs';
import { ActivityManagerService } from '../../../../shared/services/activity-manager.service';
import { TabService } from '../../../tab/tab.service';

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
  alive: boolean = false;

  constructor(
    private tabService: TabService,
    private usersChatService: UsersChatService, 
    private userService: UserService, 
    private tokenStorage: TokenStorage, 
    private socketService: SocketService,
    private favicoService: FavicoService,
    private activityManagerService: ActivityManagerService,
    private dialog: MatDialog) {

    this.fetchThreads();
    this.watchActivityChange();
    this.watchTabChange();
  }

  ngOnInit() {
    this.listenIncomingMessages();
    this.alive = true;
  }

  listenIncomingMessages() {
    this.usersChatService.currentMessage.skipWhile(() => !this.alive).subscribe(async res => {
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
            this.selectedChat.push(res.data);
            this.chatView.readyToReply();
            if (this.activityManagerService.isFocused) {
              this.updateRead();
            }
          } else {
            if (this.activityManagerService.isFocused) {
              this.usersChatService.unreadList.push(res.data);
              this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
            }
          }
          break;
        case 'newThread':
          this.fetchThreads();
          if (this.activityManagerService.isFocused) {
            this.usersChatService.unreadThreads.push(parseInt(res.data));
            this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
          }
          break;
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
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

  watchActivityChange() {
    this.activityManagerService.focusWatcher.skipWhile(() => !this.alive).subscribe((active: boolean) => {
      if (active && this.tabService.currentTab.url === 'users/chat' && this.selectedThread) {
        if (this.usersChatService.unreadList.length > 0) {
          this.updateRead();
        }
      }
    });
  }

  watchTabChange() {
    this.tabService.tabActived.subscribe(activeTab => {
      if (activeTab.url === 'users/chat' && this.selectedThread) {
        if (this.usersChatService.unreadList.length > 0) {
          const unreads = this.usersChatService.unreadList.filter(message => message.thread_id === this.selectedThread.id);
          this.selectedChat = [...this.selectedChat, ...unreads];
          this.chatView.readyToReply();
          this.updateRead();
        }
      }
    });
  }

  async fetchChatByThread(threadId: number) {
    if (this.selectedThread && this.selectedThread.id === threadId) return;
    this.readThread(threadId);
    this.selectedChat = [];
    try {
      this.selectedChat = await this.usersChatService.getMessagesByThread(threadId);
      this.selectedThread = this.threads.find(thread => thread.id === threadId);
      this.chatView.readyToReply();
      this.updateRead();
    } catch (e) {
      this.handleError(e);
    }
  }

  async sendMessage(message: any) {
    try {
      const savedMessage = await this.usersChatService.sendMessage(message);
      this.socketService.sendData(JSON.stringify({
        type: 'message',
        payload: {
          receipts: this.selectedThread.participant_ids.filter(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id)),
          sender: this.tokenStorage.getUser().id,
          content: savedMessage
        }
      }));
      this.selectedChat.push(savedMessage);
      this.chatView.readyToReply();
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

  async updateReadStatus(msgIds: number[]) {
    try {
      await this.usersChatService.updateReadStatus(msgIds);
      for (let i = this.usersChatService.unreadList.length - 1; i >= 0; i--) {
        const id = this.usersChatService.unreadList[i].id;
        if (msgIds.indexOf(id) !== -1) {
          this.usersChatService.unreadList.splice(i, 1);
        }
      }
      this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
    } catch (e) {
      this.handleError(e);
    }
  }

  async searchUsers(searchText: string) {
    if (!searchText) return;
    try {
      this.users = await this.usersChatService.searchRecipient(searchText);
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
        this.socketService.sendData(JSON.stringify({
          type: 'thread',
          payload: {
            thread: payload.thread_id,
            receipt: this.selectedThread.participant_ids.find(id => parseInt(id) !== parseInt(this.tokenStorage.getUser().id))
          }
        }));
      } catch (e) {
        this.handleError(e);
      }
    });
  }

  triggerAddUserModal() {
    this.userDialogRef = this.dialog.open(AddUserFormDialogComponent, {
      panelClass: 'add-user-form-dialog'
    });
    this.userDialogRef.afterClosed().subscribe(selectedUsers => {
      if (!selectedUsers) {
        return;
      }
      try {
        const threadId = this.selectedThread.id;
        selectedUsers.forEach(async (userId: number) => {
          await this.usersChatService.addUserIntoThread(this.selectedThread.id, userId);
        });
        this.fetchThreads();
        this.selectedThread = this.threads.find(thread => thread.id === threadId);
      } catch (e) {
        this.handleError(e);
      }
    });
  }

  handleError(e) {
    throw new Error(e);
  }
}
