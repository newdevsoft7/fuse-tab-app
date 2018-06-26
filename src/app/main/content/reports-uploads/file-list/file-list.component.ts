import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { ReportsUploadsService } from '../reports-uploads.service';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Tab } from '../../../tab/tab';
import { TabService } from '../../../tab/tab.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { TabComponent } from '../../../tab/tab/tab.component';

@Component({
  selector: 'app-reports-uploads-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  animations: fuseAnimations
})
export class ReportsUploadsFileListComponent implements OnInit, OnDestroy {

  selected: any;
  files: any[] = [];
  clicked = false;

  folders: any[] = [];

  private fileChangedSubscription: Subscription;
  private fileSelectedSubscription: Subscription;
  private currentQuizSubscription: Subscription;

  constructor(
    private reportsUploadsService: ReportsUploadsService,
    private toastr: ToastrService,
    private tabService: TabService,
    private connectorService: ConnectorService
  ) { }

  ngOnInit() {
    this.fileChangedSubscription = this.reportsUploadsService.onFilesChanged
        .subscribe(files => {
          this.files = files;
          this.folders = _.clone(this.reportsUploadsService.folders);
        });

    this.fileSelectedSubscription = this.reportsUploadsService.onFileSelected
        .subscribe(selected => {
          this.selected = selected;
        });

    this.currentQuizSubscription = this.connectorService.currentQuizTab$
        .subscribe((tab: TabComponent) => {
          if (tab) {
              const id = tab.data.id;
              switch (tab.url) {
                  case `report/${id}/view`:
                      this.tabService.closeTab(tab.url);
                      break;
                  case `report/${id}/edit`:
                      this.tabService.closeTab(tab.url);
                      const index = this.files.findIndex(v => v.id.split(':')[1] == id);
                      if (index > -1) { this.files[index].score = Math.round(+tab.data.score * 100) / 100; }
                      break;
              }
          }
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

  openFile(selected) {
    if (['quiz', 'survey'].indexOf(selected.type) < 0) { return; }
    const quiz: any = {
      view: 'contentview',
      name: selected.report,
      other_id: selected.id.split(':')[1]
    };
    const tab = new Tab(
        quiz.name,
        'quizTpl',
        `report/${quiz.id}/view`,
        quiz
    );
    this.tabService.openTab(tab);
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
        res = await this.reportsUploadsService.deleteCompletedReport(temp[0]);
      }
      //this.toastr.success(res.message);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  ngOnDestroy() {
    this.fileChangedSubscription.unsubscribe();
    this.fileSelectedSubscription.unsubscribe();
    this.currentQuizSubscription.unsubscribe();
  }

}
