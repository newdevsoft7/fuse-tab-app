import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MatDrawer, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { SettingsService } from '../../settings/settings.service';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../tab/tab.service';
import { Tab } from '../../../tab/tab';

@Component({
    selector: 'app-surveys',
    templateUrl: './surveys.component.html',
    styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {

    @ViewChild('drawer') drawer: MatDrawer;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    surveys: any[] = [];
    survey: any = null;
    selectedSurvey: any = null;
    
    constructor(
      private settingsService: SettingsService,
      private toastr: ToastrService,
      private tabService: TabService,
      private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.getSurveys();
    }

    addSurvey(): void {
        const tab = new Tab(
          'New survey',
          'quizTpl',
          `settings/surveys/new`,
          {
              name: 'New Survey',
              type: 'survey'
          }
        );
        this.tabService.openTab(tab);
    }

    getSurveys() {
        this.settingsService.getSurveys().subscribe(surveys => {
            this.surveys = surveys;
            if (surveys.length > 0) {
                this.selectSurvey(this.surveys[0]);
            }
        });
        this.drawer.open();
    }

    getSurvey(id) {
        this.settingsService.getQuiz(id).subscribe(survey => this.survey = survey);
    }

    selectSurvey(survey) {
        this.selectedSurvey = survey;
    }

    editSurvey(survey) {
        this.settingsService.saveQuiz(survey.id, survey).subscribe(res => {
        });
    }

    deleteSurvey(id, event: MouseEvent) {
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
