import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { UserService } from '../../user.service';

@Component({
    selector   : 'fuse-chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls  : ['./chat-view.component.scss']
})
export class FuseChatViewComponent implements OnInit, AfterViewInit
{
    @Input() messages: any = [];
    @Input() thread: any;

    @Output() sendMessage: EventEmitter<any> = new EventEmitter();
    @Output() updateReadStatus: EventEmitter<any> = new EventEmitter();
    @Output() addUser: EventEmitter<any> = new EventEmitter();
    replyInput: any;
    selectedChat: any;
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    @ViewChildren('replyInput') replyInputField;
    @ViewChild('replyForm') replyForm: NgForm;

    authenticatedUser: any;

    constructor(private tokenStorage: TokenStorage, private userService: UserService)
    {
        this.authenticatedUser = tokenStorage.getUser();
    }

    ngOnInit() {}

    ngAfterViewInit()
    {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply();
    }

    readyToReply()
    {
        setTimeout(() => {
            this.replyForm.reset();
            this.focusReplyInput();
            this.scrollToBottom();
        });

    }

    focusReplyInput()
    {
        setTimeout(() => {
            this.replyInput.focus();
        });
    }

    scrollToBottom(speed?: number)
    {
        speed = speed || 400;
        if ( this.directiveScroll )
        {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    reply(event)
    {
        const message = {
            thread_id: this.thread.id,
            content: this.replyForm.form.value.message
        };

        this.sendMessage.next(message);
    }
}
