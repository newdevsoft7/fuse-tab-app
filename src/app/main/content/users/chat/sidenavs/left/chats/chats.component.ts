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
    @Input() unreads: any= [];
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();

    constructor()
    {
    }

    getUnreadCounts(userId: number): number {
        return this.unreads.filter(message => message.sender_id === userId).length;
    }
}
