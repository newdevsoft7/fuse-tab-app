import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersChatService } from './chat.service';
import { UserService } from '../user.service';
import { TokenStorage } from '../../../../shared/authentication/token-storage.service';
import { FuseChatViewComponent } from './chat-view/chat-view.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-users-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class UsersChatComponent implements OnInit {

  @ViewChild(FuseChatViewComponent) chatView: FuseChatViewComponent;
  content: string;
  selectedChat: any;
  selectedUser: any;
  users: any = [];
  incomingMessage: any;

  constructor(
    private usersChatService: UsersChatService, 
    private userService: UserService, 
    private tokenStorage: TokenStorage) {

    usersChatService.currentMessage.subscribe(res => {
      if (res && res.data) {
        if (this.selectedChat) {
          this.selectedChat.push(res.data);
          this.chatView.readyToReply();
        } else {
          this.incomingMessage = res.data;
        }
      }
    });

    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const currentUserId = this.tokenStorage.getUser().id;
      this.users = (await this.userService.getUsers().map(_ => _.users).toPromise()).filter(user => user.id !== currentUserId);
    } catch (e) {
      this.handleError(e);
    }
  }

  async fetchChatByUser(userId: number) {
    this.selectedChat = [];
    try {
      this.selectedChat = await this.usersChatService.getMessagesByUser(userId);
      this.selectedUser = this.users.find(user => user.id === userId);
      this.chatView.readyToReply();
    } catch (e) {
      this.handleError(e);
    }
  }

  async sendMessage(message: any) {
    try {
      const res = await this.usersChatService.sendMessage(message);
      this.selectedChat.push(res);
      this.chatView.readyToReply();
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(e) {
    throw new Error(e);
  }

  ngOnInit()
    {
        this.usersChatService.onChatSelected
            .subscribe(chatData => {
                this.selectedChat = chatData;
            });
    }
}
