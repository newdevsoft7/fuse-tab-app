import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '../../../../../../../core/animations';
import { TokenStorage } from '../../../../../../../shared/services/token-storage.service';

@Component({
    selector   : 'fuse-chat-chats-sidenav',
    templateUrl: './chats.component.html',
    styleUrls  : ['./chats.component.scss'],
    animations : fuseAnimations
})
export class FuseChatChatsSidenavComponent
{
    @Input() users: any = [];
    @Input() sessions: any = [];
    @Input() unreads: any= [];
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();
    @Output() addContact: EventEmitter<number> = new EventEmitter();
    @Output() searchUsers: EventEmitter<string> = new EventEmitter();

    searchText: string;

    constructor(private tokenStorage: TokenStorage)
    {
    }

    getUnreadCounts(userId: number): number {
        return this.unreads.filter(message => message.sender_id === userId).length;
    }

    addContactInfo(userId: number): void {
        this.addContact.next(userId);
    }

    userBelongToContacts(userId: number): boolean {
        return !!this.sessions.find(session => session.users.split(',').indexOf(userId.toString()) > -1);
    }

    getContact(session: any) {
        return session.details.find(user => user.id !== this.tokenStorage.getUser().id);
    }
}
