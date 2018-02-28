import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '../../../../../../core/animations';

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

    constructor()
    {

    }

}
