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
    @Output() fetchChat: EventEmitter<number> = new EventEmitter();

    constructor()
    {

    }

}
