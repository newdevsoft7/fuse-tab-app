import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '../../../../../../core/animations';

@Component({
    selector   : 'fuse-chat-left-sidenav',
    templateUrl: './left.component.html',
    styleUrls  : ['./left.component.scss'],
    animations : fuseAnimations
})
export class FuseChatLeftSidenavComponent implements OnInit
{
    @Input() users: any = [];
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();
    view: string;

    constructor()
    {
        this.view = 'chats';
    }

    ngOnInit()
    {
        // this.chatService.onLeftSidenavViewChanged.subscribe(view => {
        //     this.view = view;
        // });
    }

}
