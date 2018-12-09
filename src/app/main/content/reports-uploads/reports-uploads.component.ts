import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ReportsUploadsService } from './reports-uploads.service';
import { MatSidenav, MatDialog, MatDatepickerInputEvent } from '@angular/material';

import * as _ from 'lodash';
import { ReportsSelectShiftDialogComponent } from './select-shift-dialog/select-shift-dialog.component';
import { ReportsUploadsFileListComponent } from './file-list/file-list.component';
import { Subscription } from 'rxjs';
import { fuseAnimations } from '@core/animations';
import { ToastrService } from 'ngx-toastr';
import { FusePerfectScrollbarDirective } from '@core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { CustomLoadingService } from '@shared/services/custom-loading.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports-uploads',
  templateUrl: './reports-uploads.component.html',
  styleUrls: ['./reports-uploads.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReportsUploadsComponent implements OnInit, AfterViewInit {

  @ViewChild('detailSideNav') private sidenav: MatSidenav;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileList') fileList: ReportsUploadsFileListComponent;
  @ViewChild('scrollbar') scrollbar: FusePerfectScrollbarDirective;

  folders: any[] = [];
  shiftId: any; // For uploading inside tracking_options
  fileChangedSubscription: Subscription;
  selectedFolder: any = {};

  period = {
    from: null,
    to: null
  };

  constructor(
    private reportsUploadsService: ReportsUploadsService,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.fileChangedSubscription = this.reportsUploadsService.onFilesChanged
        .subscribe(files => {
          this.folders = _.clone(this.reportsUploadsService.folders);
          setTimeout(() =>this.scrollbar.scrollToTop());
          this.selectedFolder = _.last(this.folders) || {};
        });
  }

  async ngOnInit() {
    try {
      await this.reportsUploadsService.getFiles({}, this.period);
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.sidenav.open();
    }, 200);
  }

  ngOnDestroy() {
    this.fileChangedSubscription.unsubscribe();
    this.reportsUploadsService.folders = [];
  }

  showFileUploader() {
    if (this.folders.length < 1) { return false; }
    const folder = this.folders[this.folders.length - 1];
    if (folder.type === 'Folder' && ['message_attachments', 'shared_files', 'tracking_option'].indexOf(folder.folder) > -1) {
      return true;
    } else {
      return false;
    }
  }

  async onUpload(event) {
    const selectedFolder = this.folders[this.folders.length - 1];
    const files = event.target.files;
    if (files && files.length > 0) {
      this.spinner.show();

      let formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i], files[i].name);
      }

      if (selectedFolder.folder === 'tracking_option') {
        formData.append('folder', 'shift');
        formData.append('id', this.shiftId);
      } else {
        formData.append('folder', selectedFolder.folder);
      }

      try {
        this.spinner.show();
        const res = await this.reportsUploadsService.reportsUploads(formData);
        this.spinner.hide();
        const data = res.data.map(f => {
          f.id = f.id2;
          f.name = f.oname;
          return f;
        });
        this.fileList.addFiles(data);
      } catch (e) {
        this.spinner.hide();
        _.forEach(e.error.errors, errors => {
          _.forEach(errors, (error: string) => {
            const message = _.replace(error, /file\.\d+/g, 'file');
            this.toastr.error(message);
          });
        });

      }
    }
  }

  deleteFile(file) {
    this.fileList.deleteFile(file);
  }

  onUploaderClick() {
    const folders = this.folders;
    const selectedFolder = folders[folders.length - 1];
    if (folders.length === 1 || (folders.length > 1 && selectedFolder.folder === 'tracking_category')) {
      return;
    }

    if (selectedFolder.folder === 'tracking_option') {
      const dialogRef = this.dialog.open(ReportsSelectShiftDialogComponent, {
          disableClose: false,
          panelClass: 'reports-uploads-select-shift-dialog',
          data: {
              inputEle: this.fileInput.nativeElement,
              trackingOptionId: selectedFolder.id
          }
      });
      dialogRef.afterClosed().subscribe(id => {
          if (id !== false) {
            this.shiftId = id;
          }
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  selectAll() {
    this.fileList.selectAll();
  }

  toggleSelection() {
    this.fileList.toggleSelection();
  }

  changeDate(event: MatDatepickerInputEvent<Date>, selector = 'from' || 'to') {
    this.period[selector] = event.value;
    this.reportsUploadsService.onPeriodChanged.next(this.period);
  }

}
