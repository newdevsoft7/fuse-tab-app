import {
  Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { CustomMultiSelectComponent } from '../../../../../core/components/custom-multi-select/custom-multi-select.component';
import { TemplatesService } from '../../templates.service';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';

enum Mode {
  Create = 'create',
  Edit = 'edit'
}

enum FolderType {
  Unassigned = 1,
  System = 2
}

@Component({
  selector: 'app-email-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class EmailTemplateFormComponent implements OnInit, OnChanges {

  @Input() mode = Mode.Create;

  @Input() id;

  @Output('onTemplateAdded') onTemplateAdded = new EventEmitter();
  @Output('onTemplateUpdated') onTemplateUpdated = new EventEmitter();
  @Output('onTemplateDeleted') onTemplateDeleted = new EventEmitter();

  template: any = {
    tname: '',
    from: 'company',
    subject: '',
    content: '',
    attachments: []
  };

  file: any;
  currentUser: any;
  submitting = false;
  submitted = false;

  folders: any[] = [];
  readonly Mode = Mode;

  attachmentsFiltersObservable: any;

  @ViewChild('uploadFile') uploadFile: ElementRef;
  @ViewChild('templateForm') templateForm: NgForm;
  @ViewChild('attachmentsSelector') attachmentsSelector: CustomMultiSelectComponent;

  dialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  tagsShowed: boolean = false;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private templatesService: TemplatesService,
    private tokenStorage: TokenStorage
  ) {
    this.init();
    this.currentUser = tokenStorage.getUser();
  }

  init(): void {
    this.attachmentsFiltersObservable = (text: string): Observable<any> => {
      if (text) {
        return this.templatesService.searchAttachments(text);
      } else {
        return Observable.of([]);
      }
    };
  }

  ngOnInit() {
    this.uploadFile.nativeElement.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        this.fileUpload(files[0]);
      }
    };
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
        try {
          this.tagsShowed = false;
          this.mode = Mode.Edit;
          const template = await this.templatesService.getTemplate(this.id);
          const attachments = template.attachments.map(v => { return { id: v.id, text: v.oname }; });
          this.template = {
            ...template,
            attachments
          };

          this.attachmentsSelector.value = [];
          for (let i = 0; i < template.attachments.length; i++) {
            this.file = { id: template.attachments[i].id, text: template.attachments[i].oname };
          }

          const folders = await this.templatesService.getFolders();
          this.folders = folders.filter(f => f.id !== FolderType.System);
        } catch (e) {
          this.handleError(e);
        }
    }
  }

  async fileUpload(file: File): Promise<any> {
    try {
      const res = await this.templatesService.uploadFile(file);
      this.file = { id: res.data.id, text: res.data.oname };
    } catch (e) {
      this.handleError(e);
    }
  }

  async saveTemplate() {
    if (this.mode === Mode.Create) {
      if (this.templateForm.valid) {
        this.submitting = true;
        try {
          const res = await this.templatesService.createTemplate({
            tname: this.template.tname,
            from: this.template.from,
            subject: this.template.subject,
            content: this.template.content,
            attachments: this.template.attachments.map(v => v.id)
          });
          //this.toastr.success(res.message);
          this.submitted = true;
          this.onTemplateAdded.next(res.data);
        } catch (e) {
          this.handleError(e);
        }
        this.submitting = false;
      } else {
        this.handleError({ error: { message: 'Please complete the form' } });
      }
    } else {
      if (this.templateForm.valid) {
        this.submitting = true;
        try {
          const res = await this.templatesService.updateTemplate(this.id, {
            tname: this.template.tname,
            from: this.template.from,
            subject: this.template.subject,
            content: this.template.content,
            attachments: this.template.attachments.map(v => v.id),
            folder_id: this.template.folder_id,
            active: this.template.active ? 1 : 0
          });
          //this.toastr.success(res.message);
          this.submitted = true;
          this.onTemplateUpdated.next(res.data);
        } catch (e) {
          this.handleError(e);
        }
        this.submitting = false;
      } else {
        this.handleError({ error: { message: 'Please complete the form' }});
      }
    }
  }

  async deleteTemplate() {
    this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
    this.dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const res = await this.templatesService.deleteTemplate(this.id);
          //this.toastr.success(res.message);
          this.mode = Mode.Create;
          this.resetTemplateForm();
          this.onTemplateDeleted.next(this.template);
        } catch (e) {
          this.handleError(e);
        }

      }
    });
  }

  private resetTemplateForm() {
    this.template = {
      tname: '',
      from: 'company',
      subject: '',
      content: '',
      attachments: []
    };
    this.templateForm.reset(this.template);
  }

  showAvailableTags() {
    this.tagsShowed = true;
    let content = this.template.content;
    content = content.replace('[fname]', this.currentUser.fname);
    content = content.replace('[lname]', this.currentUser.lname);
    content = content.replace('[email]', this.currentUser.email);
    this.template.content = content;
  }

  handleError(e): void {
    if (e.error && e.error.errors) {
      const errors = e.error.errors;
      Object.keys(errors).forEach(key => {
        this.toastr.error(errors[key]);
      });
    } else {
      this.toastr.error(e.error.message || 'Something is wrong!');
    }
  }
}
