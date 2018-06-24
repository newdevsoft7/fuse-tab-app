import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MatDrawer, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { SettingsService } from '../../settings/settings.service';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../tab/tab.service';
import { Tab } from '../../../tab/tab';
import { Subscription } from 'rxjs';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { TabComponent } from '../../../tab/tab/tab.component';

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
    surveyEventSubscription: Subscription; 

    
    constructor(
      private settingsService: SettingsService,
      private toastr: ToastrService,
      private tabService: TabService,
      private dialog: MatDialog,
      private connectorService: ConnectorService
    ) { }

    ngOnInit() {
        this.getSurveys();
        this.surveyEventSubscription = this.connectorService.currentQuizTab$.subscribe((tab: TabComponent) => {
            if (tab) {
                const id = tab.data.other_id;
                switch (tab.url) {
                    case 'settings/survey/new':
                    case `settings/survey/${id}/edit`:
                        this.tabService.closeTab(tab.url);
                        this.getSurveys();
                        break;
                    case `settings/survey/${id}`:
                        this.tabService.closeTab(tab.url);
                        break;
                }
            }
        });
    }

    addSurvey(): void {
        const tab = new Tab(
          'New survey',
          'quizTpl',
          `settings/survey/new`,
          {
              name: 'New Survey',
              type: 'survey'
          }
        );
        this.tabService.openTab(tab);
    }

    getSurveys() {
        this.settingsService.getReports('survey').subscribe(surveys => {
            this.surveys = surveys;
            if (surveys.length > 0) {
                this.selectSurvey(this.surveys[0]);
            }
        });
        this.drawer.open();
    }

    async saveSurvey(survey) {
        try {
            await this.settingsService.saveReport(survey.id, survey);
        } catch (e) {
            this.handleError(e);
        }
    }

    getSurvey(id) {
        this.settingsService.getQuiz(id).subscribe(survey => this.survey = survey);
    }

    selectSurvey(survey) {
        this.selectedSurvey = survey;
    }

    viewSurvey(survey, event) {
        survey.isEdit = false;
        survey.isView = true;
        const tab = new Tab(
            survey.rname,
            'quizTpl',
            `settings/survey/${survey.other_id}`,
            survey
        );
        this.tabService.openTab(tab);
    }

    editSurvey(survey) {
        event.stopPropagation();
        survey.isEdit = true;
        const tab = new Tab(
            survey.rname,
            'quizTpl',
            `settings/survey/${survey.id}/edit`,
            survey
        );
        this.tabService.openTab(tab);
    }

    deleteSurvey(id, event: MouseEvent) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    await this.settingsService.deleteReport(id);
                    const index = this.surveys.findIndex(v => v.id === id);
                    if (index > -1) { this.surveys.splice(index, 1); }
                } catch (e) {
                    this.handleError(e);
                }
            }
        });
        event.stopPropagation();
    }

    handleError(e): void {
        this.toastr.error(e.message || 'Something is wrong');
    }

}
