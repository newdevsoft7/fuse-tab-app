import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { ReportsUploadsService } from '../reports-uploads.service';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports-uploads-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  animations: fuseAnimations
})
export class ReportsUploadsFileListComponent implements OnInit, OnDestroy {

  selected: any;
  files: any[] = [];
  private alive = true;
  clicked = false;

  folders: any[] = [];

  constructor(
    private reportsUploadsService: ReportsUploadsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.reportsUploadsService.onFilesChanged
        .takeWhile(() => this.alive)
        .subscribe(files => {
          this.files = files;
          this.folders = _.clone(this.reportsUploadsService.folders);
        });

    this.reportsUploadsService.onFileSelected
        .takeWhile(() => this.alive)
        .subscribe(selected => {
          this.selected = selected;
        });
  }

  async onSelect(selected) {
    if (this.clicked) { return; }
    this.reportsUploadsService.onFileSelected.next(selected);
    if (selected.type !== 'Folder') {
      return;
    }
    try {
      this.clicked = true;
      await this.reportsUploadsService.getFiles(selected);
      this.clicked = false;
    } catch (e) {
      this.toastr.error(e.message);
      this.clicked = false;
    }
  }

  async goToParent() {
    if (this.clicked) { return; }
    try {
      this.clicked = true;
      await this.reportsUploadsService.getFiles('up');
      this.clicked = false;
    } catch (e) {
      this.toastr.error(e.message);
      this.clicked = false;
    }
  }

  addFiles(files: any[]) {
    this.files.push(...files);
  }

  async deleteFile(file) {
    try {
      const index = this.files.findIndex(f => f.id == file.id);
      this.files.splice(index, 1);
      let res: any;
      const temp = file.id.split(':');
      if (temp[0] === 'f') {
        res = await this.reportsUploadsService.deleteFile(temp[1]);
      } else {
        res = await this.reportsUploadsService.deleteCompletedReport(temp[1]);
      }
      //this.toastr.success(res.message);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
