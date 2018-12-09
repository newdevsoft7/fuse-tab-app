import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
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

  @Input() period: any;

  selected: any;
  files: any[] = [];
  clicked = false;

  folders: any[] = [];
  selectedItems: any[] = [];

  private fileChangedSubscription: Subscription;
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

    this.currentQuizSubscription = this.connectorService.currentQuizTab$
      .subscribe((tab: TabComponent) => {
        if (tab) {
          const id = tab.data.other_id;
          if (tab.url === `report/${id}/edit`) {
            this.tabService.closeTab(tab.url);
            const index = this.files.findIndex(v => v.id.split(':')[1] == id);
            if (index > -1 && tab.data.hasOwnProperty('score')) { 
              this.files[index].score = Math.round(+tab.data.score * 100) / 100; }
          }
        }
      });
  }

  async onSelect(selected, event: MouseEvent) {
    if (this.clicked) { return; }
    
  
    if (selected.type !== 'Folder') {
      if (this.selectedItems.length > 0) {
        if (event.ctrlKey || event.metaKey) {
          const index = this.selectedItems.findIndex(v => v.id === selected.id);
          if (index < 0) {
            this.selectedItems.push(selected);
          } else {
            this.selectedItems.splice(index, 1);
          }
        } else {
          this.selectedItems = [];
          this.selectedItems.push(selected);
        }
      } else {
        this.selectedItems.push(selected);
      }
      this.reportsUploadsService.onFileSelected.next(this.selectedItems);
    } else {
      this.selectedItems = [];
      try { // get contents of folders
        this.clicked = true;
        await this.reportsUploadsService.getFiles(selected, this.period);
        this.clicked = false;
      } catch (e) {
        this.toastr.error(e.message);
        this.clicked = false;
      }
    }
  }

  onTouchSelect(selected) {
    if (selected.type == 'Folder') { return; }
    if (this.selectedItems.length > 0) {
        const index = this.selectedItems.findIndex(v => v.id === selected.id);
        if (index < 0) {
          this.selectedItems.push(selected);
        } else {
          this.selectedItems.splice(index, 1);
        }
    } else {
      this.selectedItems.push(selected);
    }
    this.reportsUploadsService.onFileSelected.next(this.selectedItems);
  }

  openFile(selected, event: MouseEvent) {
    if (event.ctrlKey) { return; }
    if (['quiz', 'survey'].indexOf(selected.type) < 0) { return; }
    const quiz: any = {
      view: 'contentview',
      name: selected.report,
      other_id: selected.id.split(':')[1]
    };
    const tab = new Tab(
        quiz.name,
        'quizTpl',
        `report/${quiz.other_id}/view`,
        quiz
    );
    this.tabService.openTab(tab);
  }

  async goToParent() {
    if (this.clicked) { return; }
    try {
      this.clicked = true;
      await this.reportsUploadsService.getFiles('up', this.period);
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

  isSelected(file): boolean {
    return this.selectedItems.findIndex(v => v.id === file.id) > -1;
  }

  selectAll() {
    this.selectedItems = [...this.files];
    this.reportsUploadsService.onFileSelected.next(this.selectedItems);
  }

  toggleSelection() {
    const items = this.files.filter(v => {
      const selectedItemIds = this.selectedItems.map(k => k.id);
      return v.folder != 'Folder' && selectedItemIds.indexOf(v.id) < 0;
    });
    this.selectedItems = [...items];
    this.reportsUploadsService.onFileSelected.next(this.selectedItems);
  }

  ngOnDestroy() {
    this.fileChangedSubscription.unsubscribe();
    this.currentQuizSubscription.unsubscribe();
  }

  clickMore(file, event) {
    if(this.selectedItems.findIndex(v => v.id == file.id) > -1) {
      event.stopPropagation()
    }
  }

}
