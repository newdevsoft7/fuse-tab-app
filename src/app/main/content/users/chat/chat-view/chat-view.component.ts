import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { UsersChatService } from '../chat.service';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

@Component({
    selector   : 'fuse-chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls  : ['./chat-view.component.scss']
})
export class FuseChatViewComponent implements OnInit, AfterViewInit
{
    @Input() messages: any = [];
    @Input() user: any;
    @Output() sendMessage: EventEmitter<any> = new EventEmitter();
    @Output() updateReadStatus: EventEmitter<any> = new EventEmitter();
    replyInput: any;
    selectedChat: any;
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    @ViewChildren('replyInput') replyInputField;
    @ViewChild('replyForm') replyForm: NgForm;

    constructor(private chatService: UsersChatService)
    {
    }

    ngOnInit() {
    }

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
                this.updateRead();
            });
        }
    }

    updateRead() {
        const unreads = this.messages.filter(message => parseInt(message.read) === 0 && parseInt(message.sender_id) === this.user.id).map(message => parseInt(message.id));
        if (unreads.length > 0) {
            this.updateReadStatus.next(unreads);
        }
    }

    reply(event)
    {
        const message = {
            receiver: this.user.id,
            content: this.replyForm.form.value.message
        };

        this.sendMessage.next(message);
    }
}
