import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit } from "@angular/core";
import { TokenStorage } from "../../../../shared/services/token-storage.service";
import { MessageService } from "./message.service";
import { Observable } from "rxjs/Observable";
import { NgForm, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { CustomMultiSelectComponent } from "../../../../core/components/custom-multi-select/custom-multi-select.component";
import { TabService } from "../../../tab/tab.service";
import { TAB } from "../../../../constants/tab";

@Component({
  selector: 'app-user-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {

  @Input() data: any = {};

  message: any = {
    thread: 0,
    email: 0,
    attachments: [],
    recipients: []
  };

  fromEmails: any = [];
  templateControl: FormControl = new FormControl();
  
  recipientsFiltersObservable: any;
  attachmentsFiltersObservable: any;
  count: number = 0;
  
  file: any;
  
  sending: boolean = false;
  sent: boolean = false;
  templates: any = [];
  
  props: any = {};
  
  @ViewChild('template') template: ElementRef;
  @ViewChild('uploadFile') uploadFile: ElementRef;
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('attachmentsSelector') attachmentsSelector: CustomMultiSelectComponent;

  constructor(
    private tokenStorage: TokenStorage,
    private toastr: ToastrService,
    private tabService: TabService,
    private messageService: MessageService) {
  }

  init(): void {
    this.fromEmails = this.tokenStorage.getSettings().from_emails;
    this.message.from = this.fromEmails[0].id;
    this.message.recipients = this.props.recipients? this.props.recipients : [];
    if (this.message.recipients.length > 0) {
      this.onRecipientFiltersChanged(this.message.recipients);
    }
    if (this.props.template) {
      if (this.props.shiftRoleId !== null) {
        this.selectTemplate(this.props.template, { shiftRoleId: this.props.shiftRoleId });
      } else {
        this.selectTemplate(this.props.template);
      }
    }
    this.recipientsFiltersObservable = (text: string): Observable<any> => {
      if (text) {
        return this.messageService.searchRecipients(this.props.action || 'normal', text);
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

    this.props.index = this.data.index;
    this.props.action = this.data.action;
    this.props.id = this.data.id;
    this.props.recipients = this.data.recipients;
    this.props.template = this.data.template;
    this.props.shiftRoleId = this.data.shiftRoleId;

    this.init();

    if (this.props.action) {
      this.fetchTemplateContent();
    }
  }

  ngAfterViewInit() {
    if (this.props.template) {
      setTimeout(() => this.template.nativeElement.value = this.props.template.tname);
    }
  }

  async fetchTemplateContent(): Promise<any> {
    try {
      const res = await this.messageService.fetchContent(this.props.id, this.props.action);
      this.message.content = res.content;
      this.message.subject = res.subject;
      for (let i = 0; i < res.attachments.length; i++) {
        this.file = { id: res.attachments[i].id, text: res.attachments[i].oname };
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  async onRecipientFiltersChanged(filters: any): Promise<any> {
    if (filters.length === 0) {
      this.count = 0;
      return;
    }
    try {
      const res = await this.messageService.send({
        content: 'test',
        count: 1,
        recipients: filters.map(v => v.id)
      });
      this.count = res.count;
      if (this.count < 2) {
        this.message.thread = 0;
      }
    } catch (e) {
      this.handleError(e);
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
      this.handleError(e);
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
      this.handleError(e);
    }
  }

  async sendMessage(): Promise<any> {
    if (this.messageForm.valid) {
      this.sending = true;
      try {
        const res = await this.messageService.send({
          content: this.message.content,
          recipients: this.message.recipients.map(v => v.id),
          count: 0,
          thread: this.message.thread,
          email: this.message.email,
          subject: this.message.subject,
          from: this.message.from,
          attachments: this.message.attachments.map(v => v.id)
        });
        //this.toastrService.success('Email has been sent successfully!');
        this.messageForm.reset(this.message);
        this.sent = true;
        if (this.props.action) {
          this.tabService.closeTab(`${TAB.USERS_NEW_MESSAGE_TAB.url}/${this.props.index}`);
        }
      } catch (e) {
        this.handleError(e);
      }
      this.sending = false;
    } else {
      this.handleError({ error: { message: 'Please complete the form' }});
    }
  }

  templateDisplayFn(template?: any): string {
    return template? template.tname : '';
  }

  async selectTemplate(event: any, options?): Promise<any> {
    try {
      let id;
      if (event instanceof MatAutocompleteSelectedEvent) {
        id = event.option.value.id;
      } else {
        id = event.id;
      }
      const template = await this.messageService.getTemplate(id, options);
      this.attachmentsSelector.value = [];
      for (let i = 0; i < template.attachments.length; i++) {
        this.file = { id: template.attachments[i].id, text: template.attachments[i].oname }
      }
      this.message.content = template.content;
      this.message.subject = template.subject;
      this.message.from = template.from;
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(e): void {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    }
    else {
      this.toastr.error(e.error.message);
    }
  }
}
