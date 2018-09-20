import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { ReportsUploadsService } from '../../reports-uploads.service';
import * as _ from 'lodash';
import { TabService } from '../../../../tab/tab.service';
import { Tab } from '../../../../tab/tab';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleChange, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reports-uploads-details-sidenav',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: fuseAnimations
})
export class ReportsUploadsDetailsSidenavComponent implements OnInit {

  selected: any;
  selectedItems: any[];
  private alive = true;
  selectedFolder: any = {};
  currentUser: any;

  @Output() onFileDeleted = new EventEmitter;

  constructor(
    private reportsUploadsService: ReportsUploadsService,
    private tabService: TabService,
    private tokenStorage: TokenStorage,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.currentUser = this.tokenStorage.getUser();
  }

  ngOnInit() {
    this.reportsUploadsService.onFileSelected
        .takeWhile(() => this.alive)
        .subscribe(selected => {
          if (selected.length > 1) { // multiple items selected
            this.selectedItems = selected;
            this.selected = null;
          } else {
            this.selected = selected.length === 1 ? selected[0] : {};
            this.selectedItems = []; // multiple items not selected
          }
          const folders = _.clone(this.reportsUploadsService.folders);
          this.selectedFolder = _.last(folders); 
        });
  }

  openShift() {
    const id = this.selected.shift_id;
    let url: string;
    let template: string;
    switch (this.currentUser.lvl) {
      case 'admin':
      case 'owner':
        url = `admin/shift/${id}`
        template = 'adminShiftTpl';
        break;

      // TODO - For client users

      default:
        break;
    } 
    const tab = new Tab(this.selected.shift_title, template, url, { url, id });
    this.tabService.openTab(tab);
  }

  delete() {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = 'Are you sure?';
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onFileDeleted.next({ ...this.selected });
        this.selected = {};
      }
    });
  }

  openMultiple() {
    const otherIds = this.selectedItems.map(v => v.id.split(':')[1]);
    const quizzes = {
      other_ids: otherIds,
      name: 'Summary'
    };
    const tab = new Tab(
      'Summary',
      'quizTpl',
      `surveys/${otherIds.join('-')}`,
      quizzes
    );
    this.tabService.openTab(tab);
  }

  async approve(event: MatSlideToggleChange) {
    const value = event.checked ? 1 : 0;
    try {
      const temp = this.selected.id.split(':'); // e.g id is 'f:23'
      const type = temp[0] === 'f' ? 'upload' : 'report';
      await this.reportsUploadsService.reportsUploadsApprove(type, type === 'upload' ? temp[1] : temp[0], value);
    } catch (e) {
      this.toastr.error(e.message);
      this.selected.approved = value ? 0 : 1;
    }
  }

  edit() {
    const quiz: any = {
      view: 'contentedit',
      name: this.selected.report,
      other_id: this.selected.id.split(':')[1],
      approved: this.selected.approved
    };
    const tab = new Tab(
        quiz.name,
        'quizTpl',
        `report/${quiz.other_id}/edit`,
        quiz
    );
    this.tabService.openTab(tab);
  }

  downloadReports() {
    const ids = this.selectedItems.map(v => v.id.split(':')[0]);
    this.reportsUploadsService.downloadReports(ids);
  }

  downloadZip() {
    let params: any = {};
    switch (this.selectedFolder.folder) {
      case 'report':
        params = {
          report_ids: this.selectedItems.map(v => +v.id.split(':')[0])
        };
        break;

      case 'tracking_option':
        params = {
          file_ids: this.selectedItems.map(v => +v.id.split(':')[1])
        };
        break;

      default:
        break;
    }
    this.reportsUploadsService.downloadZip(params);

  }

  download() {
    if (['survey', 'quiz'].indexOf(this.selected.type) > -1) {
      const id = this.selected.id.split(':')[0];
      this.reportsUploadsService.downloadReports([id]);
    }
  }

}
