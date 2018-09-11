import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fuseAnimations } from '../../../../../../../core/animations';
import { FuseMatSidenavHelperService } from '../../../../../../../core/directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.service';
import { ObservableMedia } from '@angular/flex-layout';

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
    @Output() searchUsers: EventEmitter<any> = new EventEmitter();

    searchText: string;
    threads: any = [];

    constructor(
        private fuseMatSidenavHelperService: FuseMatSidenavHelperService,
        public observableMedia: ObservableMedia
    ) {}

    tapContact(user: any) {
        if (user.type === 'user') {
            this.addContact.next(user.id);
        } else {
            this.fetchChat.next(user.id);
            this.searchText = '';
        }
        this.toggleSideNav();
    }

    onThreadClick(thread) {
        this.fetchChat.next(thread.id);
        this.toggleSideNav();
    }

    toggleSideNav() {
        if (!this.observableMedia.isActive('gt-md')) {
            this.fuseMatSidenavHelperService.getSidenav('chat-left-sidenav').toggle();
        }
    }
}
