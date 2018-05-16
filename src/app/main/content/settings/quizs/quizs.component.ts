import {
  Component, OnInit, Input,
  Output, EventEmitter, ViewChild
} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {MatSlideToggleChange, MatSelectChange, MatDrawer} from '@angular/material';
import {FuseConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';

import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {TabService} from '../../../tab/tab.service';
import {Tab} from '../../../tab/tab';


import {SettingsService} from '../settings.service';

enum Setting {
  quiz_enable = 43
}


@Component({
  selector: 'app-settings-quizs',
  templateUrl: './quizs.component.html',
  styleUrls: ['./quizs.component.scss']
})
export class SettingsQuizsComponent implements OnInit {

  @Input() settings = [];
  @Input() options = [];

  @Output() settingsChange = new EventEmitter();

  @ViewChild('drawer') drawer: MatDrawer;
  dialogRef: MatDialogRef<FuseConfirmDialogComponent>;


  readonly Setting = Setting;

  quizes: any[] = [];
  quiz: any = null;
  selectedQuiz: any = null;

  constructor(private settingsService: SettingsService,
              private toastr: ToastrService,
              private tabService: TabService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getQuizes();
  }

  value(id: Setting) {
    if (_.isEmpty(this.settings)) {
      return;
    }
    const value = _.find(this.settings, ['id', id]);
    return _.toInteger(value.value) === 0 ? false : true;
  }

  onChange(id: Setting, event: MatSlideToggleChange) {
    if (_.isEmpty(this.settings)) {
      return;
    }
    console.log(id);
    const setting = _.find(this.settings, ['id', id]);
    const value = event.checked ? 1 : 0;

    console.log(id);
    console.log(value);
    this.settingsService.setSetting(id, value).subscribe(res => {
      setting.value = value;
      this.settingsChange.next(this.settings);
      this.toastr.success(res.message);
    });
  }

  addQuiz(): void {
    const tab = new Tab(
      'New Quiz',
      'quizTpl',
      `settings/quiz/new`,
      {
        name: 'New Quiz'
      }
    );
    this.tabService.openTab(tab);
  }

  getQuizes() {
    this.settingsService.getQuizes().subscribe(quizes => {
      console.log(quizes);
      this.quizes = quizes;
      if (quizes.length > 0) {
        this.selectQuiz(this.quizes[0]);
      }
    });
    this.drawer.open();
  }

  getQuiz(id) {
    this.settingsService.getQuiz(id).subscribe(quiz => this.quiz = quiz);
  }

  editQuiz(quiz) {
    this.settingsService.saveQuiz(quiz.id, quiz).subscribe(res => {
      this.toastr.success(res.message);
    });
  }

  selectQuiz(quiz) {
    this.selectedQuiz = quiz;
    console.log(quiz);
    // this.getQuiz(quiz.id);
  }

  deleteQuiz(id, event: MouseEvent) {
    this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO - Delete Form
      }
    });
    event.stopPropagation();
  }

}
