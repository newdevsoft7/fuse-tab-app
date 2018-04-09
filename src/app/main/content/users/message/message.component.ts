import { Component, ViewChild, ElementRef } from "@angular/core";
import { TokenStorage } from "../../../../shared/services/token-storage.service";
import { MessageService } from "./message.service";
import { Observable } from "rxjs/Observable";
import { CustomMultiSelectComponent } from "../../../../core/components/custom-multi-select/custom-multi-select.component";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-user-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  message: any = {
    thread: 0,
    email: 0
  };

  fromEmails: any = [];
  recipients: any = [];
  attachments: any = [];

  recipientsFiltersObservable: any;
  attachmentsFiltersObservable: any;
  count: number = 0;

  file: any;
  files: any = [];

  sending: boolean = false;
  sent: boolean = false;

  @ViewChild('uploadFile') uploadFile: ElementRef;
  @ViewChild('messageForm') messageForm: NgForm;

  constructor(
    private tokenStorage: TokenStorage,
    private toastrService: ToastrService,
    private messageService: MessageService) {

    this.init();
  }

  init(): void {
    this.fromEmails = this.tokenStorage.getSettings().from_emails;
    this.message.from = this.fromEmails[0].id;
    this.message.recipients = [];
    this.recipientsFiltersObservable = (text: string): Observable<any> => {
      if (text) {
        return this.messageService.searchRecipients(text);
      } else {
        return Observable.of([]);
      }
    };
    this.attachmentsFiltersObservable = (text: string): Observable<any> => {
      if (text) {
        return this.messageService.searchAttachments(text);
      } else {
        return Observable.of([]);
      }
    }
  }

  ngOnInit() {
    this.uploadFile.nativeElement.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        this.fileUpload(files[0]);
      }
    }
  }

  async onRecipientFiltersChanged(filters: any): Promise<any> {
    this.message.recipients = filters;
    try {
      const res = await this.messageService.send({
        content: 'test',
        count: 1,
        recipients: filters
      });
      this.count = res.count;
    } catch (e) {
      this.handleError(e.error);
    }
  }

  onAttachmentsFiltersChanged(filters: any): void {
    this.files = filters;
  }

  updateEmailToggler(value: boolean) {
    this.message.email = value? 1 : 0;
  }

  async fileUpload(file: File) {    
    try {
      const res = await this.messageService.uploadFile(file);
      this.file = { id: res.data.id, text: res.data.oname };
    } catch (e) {
      this.handleError(e.error);
    }
  }

  async sendMessage() {
    if (this.messageForm.valid) {
      this.sending = true;
      try {
        const res = await this.messageService.send({
          content: this.message.content,
          recipients: this.message.recipients,
          count: 0,
          thread: this.message.thread,
          email: this.message.email,
          subject: this.message.subject,
          from: this.message.from
        });
        this.sent = true;
      } catch (e) {
        this.handleError(e.error);
      }
      this.sending = false;
    } else {
      this.handleError({ message: 'Please complete the form' });
    }
  }

  handleError(e) {
    this.toastrService.error(e.message || 'Something is wrong');
  }
}
