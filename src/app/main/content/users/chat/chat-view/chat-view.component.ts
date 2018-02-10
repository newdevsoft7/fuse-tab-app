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
    chat: any;
    dialog: any;
    contact: any;
    replyInput: any;
    selectedChat: any;
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    @ViewChildren('replyInput') replyInputField;
    @ViewChild('replyForm') replyForm: NgForm;

    constructor(private chatService: UsersChatService)
    {
    }

    ngOnInit()
    {
        // this.user = this.chatService.user;
        // this.chatService.onChatSelected
        //     .subscribe(chatData => {
        //         if ( chatData )
        //         {
        //             this.selectedChat = chatData;
        //             this.contact = chatData.contact;
        //             this.dialog = chatData.dialog;
        //             this.readyToReply();
        //         }
        //     });
    }

    ngAfterViewInit()
    {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply();
    }

    selectContact()
    {
        this.chatService.selectContact(this.contact);
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
            receiver: this.user.id,
            content: this.replyForm.form.value.message
        };

        this.sendMessage.next(message);
    }
}
