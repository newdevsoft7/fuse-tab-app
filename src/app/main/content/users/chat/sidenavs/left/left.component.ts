import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { fuseAnimations } from '../../../../../../core/animations';
import {FuseChatChatsSidenavComponent} from './chats/chats.component';

@Component({
    selector   : 'fuse-chat-left-sidenav',
    templateUrl: './left.component.html',
    styleUrls  : ['./left.component.scss'],
    animations : fuseAnimations
})
export class FuseChatLeftSidenavComponent
{
    @Input() users: any = [];
    @Input() threads: any = [];
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();
    @Output() searchUsers: EventEmitter<string> = new EventEmitter();
    @Output() addContact: EventEmitter<number> = new EventEmitter();
    @ViewChild(FuseChatChatsSidenavComponent) chatSideNav: FuseChatChatsSidenavComponent

    constructor()
    {

    }

    selectThread(threadId) {
      this.chatSideNav.onThreadClick({ id: threadId });
    }

}
