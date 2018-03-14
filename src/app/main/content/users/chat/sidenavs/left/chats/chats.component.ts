import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '../../../../../../../core/animations';

@Component({
    selector   : 'fuse-chat-chats-sidenav',
    templateUrl: './chats.component.html',
    styleUrls  : ['./chats.component.scss'],
    animations : fuseAnimations
})
export class FuseChatChatsSidenavComponent
{
    @Input() users: any = [];
    @Input('threads') set updateThreads(value: any) {
        this.threads = value;
        this.searchText = '';
    }
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();
    @Output() addContact: EventEmitter<number> = new EventEmitter();
    @Output() searchUsers: EventEmitter<string> = new EventEmitter();

    searchText: string;
    threads: any = [];

    constructor() {}

    tapContact(user: any) {
        if (user.type === 'user') {
            this.addContact.next(user.id);
        } else {
            this.fetchChat.next(user.id);
            this.searchText = '';
        }
    }
}
