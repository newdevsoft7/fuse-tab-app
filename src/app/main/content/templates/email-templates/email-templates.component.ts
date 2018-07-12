import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TemplatesService } from '../templates.service';
import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

enum FolderType {
  Unassigned = 1,
  System = 2
}

enum Mode {
  NewFolder,
  EditFolder,
  NewTemplate,
  EditTemplate
}

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailTemplatesComponent implements OnInit {

  folders: any[] = [];
  selectedTemplate: any;
  selectedFolder: any = {};

  mode: Mode = null;

  folderForm: FormGroup;

  readonly Mode = Mode;
  readonly FolderType = FolderType;

  dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private templatesService: TemplatesService,
    private toastr: ToastrService,
    private spinner: CustomLoadingService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getFolders();

    this.folderForm = this.formBuilder.group({
      fname: ['', Validators.required]
    });
  }

  async getFolders() {
    try {
      this.folders = await this.templatesService.getFolders();
    } catch (e) {
      this.handleError(e);
    }
  }

  selectFolder(ev, folder) {
    ev.preventDefault();
    if (folder.templates.length > 0) {
      folder.isOpen = folder.isOpen ? false : true;
    }
    this.selectedFolder = folder;
    this.selectedTemplate = null;
    if ([FolderType.System, FolderType.Unassigned].includes(this.selectedFolder.id)) {
      this.mode = null;
    } else {
      this.mode = Mode.EditFolder;
      this.folderForm.patchValue({ fname: this.selectedFolder.fname });
    }
  }

  selectTemplate(template) {
    this.selectedTemplate = template;
    this.mode = Mode.EditTemplate;
  }

  openNewFolderEdit() {
    this.mode = Mode.NewFolder;
    this.folderForm.patchValue({ fname: '' });
  }

  openNewTemplateEdit() {
    this.mode = Mode.NewTemplate;
  }

  async saveFolder() {
    if (this.mode === Mode.NewFolder) {
      try {
        const response = await this.templatesService.createFolder({ fname: this.folderForm.getRawValue().fname });
        const folder = response.data;
        folder.templates = [];
        this.folders.splice(this.folders.length - 1, 0, folder);
        //this.toastr.success(response.message);
      } catch (e) {
        this.handleError(e);
      }
    } else {
      try {
        const fname = this.folderForm.getRawValue().fname;
        const response = await this.templatesService.updateFolder(this.selectedFolder.id, { fname });
        this.selectedFolder.fname = fname;
        //this.toastr.success(response.message);
      } catch (e) {
        this.handleError(e);
      }
    }

  }

  async deleteFolder() {
    this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
    this.dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const response = await this.templatesService.deleteFolder(this.selectedFolder.id);
          const unassignedFolder = this.folders.find(f => f.id === FolderType.Unassigned);
          unassignedFolder.templates.push(...this.selectedFolder.templates);
          const index = this.folders.findIndex(f => f.id === this.selectedFolder.id);
          this.folders.splice(index, 1);
          //this.toastr.success(response.message);
        } catch (e) {
          this.handleError(e);
        }
      }
    });
  }

  onTemplateAdded(template) {
    const unassignedFolder = this.folders.find(f => f.id === FolderType.Unassigned);
    unassignedFolder.templates.push(template);
    this.selectTemplate(template);
  }

  onTemplateDeleted(template) {
    let folder;
    if (template.folder_id) {
      folder = this.folders.find(f => f.id === template.folder_id);
    } else {
      folder = this.folders.find(f => f.id === FolderType.Unassigned);
    }
    if (folder) {
      const index = folder.templates.findIndex(t => t.id === template.id);
      folder.templates.splice(index, 1);
    }
  }

  onTemplateUpdated(template) {
    const toFolder = this.folders.find(f => f.id === template.folder_id);
    let fromFolder;
    let temp;

    this.folders.every(f => {
      temp = f.templates.find(t => t.id === template.id);
      if (temp) {
        fromFolder = f;
        return false;
      } else {
        return true;
      }
    });

    // Change template name
    if (temp) {
      temp.tname = template.tname;
    }

    // Move
    if (toFolder.id !== fromFolder.id && template.sys_id !== 1) {
      toFolder.templates.push(temp);
      const index = fromFolder.templates.findIndex(t => t.id === temp.id);
      fromFolder.templates.splice(index, 1);
    }

  }

  handleError(e): void {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(errors).forEach(key => {
        this.toastr.error(errors[key]);
      });
    } else {
      this.toastr.error(e.error.message || 'Something is wrong!');
    }
  }

}
