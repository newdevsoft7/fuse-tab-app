import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import { TokenStorage } from "../../../../shared/services/token-storage.service";
import { MessageService } from "./message.service";
import { Observable } from "rxjs/Observable";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { CustomMultiSelectComponent } from "../../../../core/components/custom-multi-select/custom-multi-select.component";

@Component({
  selector: 'app-user-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  @Input('data') set updateData(data: any) {
    if (data) {
      this.message = { ...this.message, ...data };
    }
  }

  message: any = {
    thread: 0,
    email: 0,
    attachments: [],
    recipients: []
  };

  fromEmails: any = [];

  recipientsFiltersObservable: any;
  attachmentsFiltersObservable: any;
  count: number = 0;

  file: any;

  sending: boolean = false;
  sent: boolean = false;
  templates: any = [];

  @ViewChild('uploadFile') uploadFile: ElementRef;
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('attachmentsSelector') attachmentsSelector: CustomMultiSelectComponent;

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
    if (filters.length < 2) {
      this.message.thread = 0;
    }
    if (filters.length === 0) return;
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

  async filterTemplates(searchText: string): Promise<any> {
    if (!searchText) {
      this.templates = [];
      return;
    }
    try {
      this.templates = await this.messageService.searchTemplates(searchText);
    } catch (e) {
      this.handleError(e.error);
    }
  }

  updateEmailToggler(value: boolean): void {
    this.message.email = value? 1 : 0;
  }

  async fileUpload(file: File): Promise<any> {    
    try {
      const res = await this.messageService.uploadFile(file);
      this.file = { id: res.data.id, text: res.data.oname };
    } catch (e) {
      this.handleError(e.error);
    }
  }

  async sendMessage(): Promise<any> {
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
          from: this.message.from,
          attachments: this.message.attachments
        });
        this.toastrService.success('Email has been sent successfully!');
        this.messageForm.reset(this.message);
        this.sent = true;
      } catch (e) {
        this.handleError(e.error);
      }
      this.sending = false;
    } else {
      this.handleError({ message: 'Please complete the form' });
    }
  }

  templateDisplayFn(template?: any): string {
    return template? template.tname : '';
  }

  async selectTemplate(event: MatAutocompleteSelectedEvent): Promise<any> {
    try {
      const template = await this.messageService.getTemplate(event.option.value.id);
      this.attachmentsSelector.value = [];
      for (let i = 0; i < template.attachments.length; i++) {
        this.file = { id: template.attachments[i].id, text: template.attachments[i].oname }
      }
      this.message.content = template.content;
      this.message.subject = template.subject;
      this.message.from = template.from;
    } catch (e) {
      this.handleError(e.error);
    }
  }

  handleError(e): void {
    this.toastrService.error(e.message || 'Something is wrong');
  }
}
