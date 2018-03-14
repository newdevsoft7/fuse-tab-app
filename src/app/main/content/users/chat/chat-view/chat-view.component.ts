import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { UserService } from '../../user.service';

@Component({
    selector   : 'fuse-chat-view',
    templateUrl: './chat-view.component.html',
    styleUrls  : ['./chat-view.component.scss']
})
export class FuseChatViewComponent implements OnInit, AfterViewInit, OnChanges
{
    @Input() messages: any = [];
    @Input('thread') set updateThread(thread: any) {
        if (thread) {
            this.thread = thread;
            this.updateParticipants();
            this.currentPage = 0;
            this.readyToReply();
        }
    }

    @Input('replyMessage') set updateReply(value: string) {
        value = value || '';
        setTimeout(() => {
            this.replyForm.form.setValue({ message: value })
        });
    }

    @Input() typingUsers: number[] = [];
    @Input() paginationDisabled: boolean = false;

    @Output() sendMessage: EventEmitter<any> = new EventEmitter();
    @Output() updateReadStatus: EventEmitter<number> = new EventEmitter();
    @Output() addUser: EventEmitter<any> = new EventEmitter();
    @Output() updatePendingMessage: EventEmitter<string> = new EventEmitter();
    @Output() updateTypingStatus: EventEmitter<boolean> = new EventEmitter();
    @Output() fetchMessages: EventEmitter<number> = new EventEmitter();

    replyInput: any;
    selectedChat: any;
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    @ViewChildren('replyInput') replyInputField;
    @ViewChild('replyForm') replyForm: NgForm;

    authenticatedUser: any;
    thread: any;
    participants: any = [];

    isTyping: boolean = false;
    typingSentence: string = '';

    currentPage: number = 0;
    loading: boolean = true;    

    constructor(private tokenStorage: TokenStorage, private userService: UserService)
    {
        this.authenticatedUser = tokenStorage.getUser();
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.messages && !changes.messages.firstChange) || (changes.paginationDisabled && changes.paginationDisabled.currentValue)) {
            this.loading = false;
        }
        if ((changes.messages && !changes.messages.firstChange && changes.messages.currentValue.length === 0 && !this.paginationDisabled)) {
            this.loading = true;
        }
    }

    ngAfterViewInit()
    {
        this.replyInput = this.replyInputField.first.nativeElement;
    }

    getTypingText() {
        if (this.typingUsers.length === 0) {
            return '';
        }
        let namePrefix = this.typingUsers.map(id => `${this.getParticipant(id).fname} ${this.getParticipant(id).lname}`).join(' and ');
        return `${namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1)} ${this.typingUsers.length > 1? 'are' : 'is'} typing...`;
    }

    getParticipant(userId: number) {
        return this.participants.find(user => user.id === userId);
    }

    updateParticipants() {
        try {
            this.thread.participant_ids.forEach(async (id: number) => {
                this.participants.push(await this.userService.getUser(id).toPromise());
            });
        } catch (e) {
            console.error(e);
        }
    }

    readyToReply(read?: boolean)
    {
        read = read || false;
        setTimeout(() => {
            this.focusReplyInput();
            this.scrollToBottom();
            if (read) {
                this.updateReadStatus.next(this.thread.id);
            }
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
        if (!this.replyForm.form.value.message) return;
        const message = {
            thread_id: this.thread.id,
            content: this.replyForm.form.value.message
        };
        this.stopTyping();
        this.sendMessage.next(message);
    }

    continueTyping() {
        if (!this.isTyping) {
            this.updateTypingStatus.next(true);
            this.isTyping = true;
        }
    }

    stopTyping() {
        this.updateTypingStatus.next(false);
        this.isTyping = false;
    }

    detectScrollTop(event: CustomEvent) {
        if (this.currentPage > 0 && !this.paginationDisabled) {
            this.loading = true;
            this.fetchMessages.next(this.currentPage);
        }
        this.currentPage++;
    }
}
