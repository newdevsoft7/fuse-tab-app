import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { ReportsUploadsService } from './reports-uploads.service';
import { MatSidenav, MatDialog } from '@angular/material';

import * as _ from 'lodash';
import { CustomLoadingService } from '../../../shared/services/custom-loading.service';
import { ToastrService } from 'ngx-toastr';
import { ReportsSelectShiftDialogComponent } from './select-shift-dialog/select-shift-dialog.component';
import { ReportsUploadsFileListComponent } from './file-list/file-list.component';

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

  private alive = true;
  folders: any[] = [];
  shiftId: any; // For uploading inside tracking_options

  constructor(
    private reportsUploadsService: ReportsUploadsService,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.reportsUploadsService.onFilesChanged
        .takeWhile(() => this.alive)
        .subscribe(files => {
          this.folders = _.clone(this.reportsUploadsService.folders);
        });
  }

  async ngOnInit() {
    try {
      await this.reportsUploadsService.getFiles({});
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
    this.alive = false;
    this.reportsUploadsService.folders = [];
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
        this.toastr.success(res.message);
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

}
