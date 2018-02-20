import { Component, ViewChild } from '@angular/core';
import { UsersChatService } from './chat.service';
import { UserService } from '../user.service';
import { TokenStorage } from '../../../../shared/authentication/token-storage.service';
import { FuseChatViewComponent } from './chat-view/chat-view.component';
import { SocketService } from '../../../../shared/socket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { FavicoService } from '../../../../shared/favico.service';

@Component({
  selector: 'app-users-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class UsersChatComponent {

  @ViewChild(FuseChatViewComponent) chatView: FuseChatViewComponent;
  content: string;
  selectedChat: any;
  selectedUser: any;
  users: any = [];
  sessions: any = [];

  constructor(
    private usersChatService: UsersChatService, 
    private userService: UserService, 
    private tokenStorage: TokenStorage, 
    private socketService: SocketService,
    private favicoService: FavicoService) {

    usersChatService.currentMessage.subscribe(res => {
      if (!res || !res.type) return;
      switch (res.type) {
        case 'newMessage':
          res.data.sent = 1;
          if (!this.selectedChat) {
            this.usersChatService.unreadList.push(res.data);
            this.favicoService.setBadge(this.usersChatService.unreadList.length);
            return;
          }
          if (parseInt(res.data.sender_id) === this.selectedUser.id) {
            this.selectedChat.push(res.data);
            this.chatView.readyToReply();
          } else {
            this.usersChatService.unreadList.push(res.data);
            this.favicoService.setBadge(this.usersChatService.unreadList.length);
          }
          break;
        case 'unread':
          if (!this.selectedChat) return;
          for (let i = 0; i < this.selectedChat.length; i++) {
            const message = this.selectedChat[i];
            if (res.data.indexOf(message.id) !== -1) {
              message.read = 1;
            }
          }
          break;
      }
    });

    this.fetchSessions();
  }

  getUnreads() {
    return this.usersChatService.unreadList;
  }

  async fetchSessions() {
    try {
      const currentUserId = this.tokenStorage.getUser().id;
      this.sessions = await this.usersChatService.getContactSessions();
    } catch (e) {
      this.handleError(e);
    }
  }

  async fetchChatBySession(sessionId: number) {
    this.selectedChat = [];
    try {
      this.selectedChat = await this.usersChatService.getMessagesBySession(sessionId);
      this.selectedUser = this.users.find(user => user.id === sessionId);
      this.chatView.readyToReply();
    } catch (e) {
      this.handleError(e);
    }
  }

  async sendMessage(message: any) {
    try {
      const payload = await this.usersChatService.sendMessage(message);
      this.socketService.sendData(JSON.stringify({
        type: 'message',
        payload
      }));
      this.selectedChat.push(payload);
      this.chatView.readyToReply();
    } catch (e) {
      this.handleError(e);
    }
  }

  async updateReadStatus(msgIds: number[]) {
    try {
      await this.usersChatService.updateReadStatus(msgIds);
      this.socketService.sendData(JSON.stringify({
        type: 'unread',
        payload: {
          receiver_id: this.selectedUser.id,
          ids: msgIds
        }
      }));
      for (let i = this.usersChatService.unreadList.length - 1; i >= 0; i--) {
        const id = this.usersChatService.unreadList[i].id;
        if (msgIds.indexOf(id) !== -1) {
          this.usersChatService.unreadList.splice(i, 1);
        }
      }
      this.favicoService.setBadge(this.usersChatService.unreadList.length);
    } catch (e) {
      this.handleError(e);
    }
  }

  async searchUsers(searchText: string) {
    if (!searchText) return;
    try {
      const currentUserId = this.tokenStorage.getUser().id;
      this.users = (await this.userService.getUsers().map(_ => _.data).toPromise()).filter(user => user.id !== currentUserId);
    } catch (e) {
      this.handleError(e);
    }
  }

  async addContact(userId: number) {
    try {
      const session = await this.usersChatService.addContactSession(userId);
      this.sessions.push(session);
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(e) {
    throw new Error(e);
  }
}
