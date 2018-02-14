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
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();

    constructor()
    {
    }
}
