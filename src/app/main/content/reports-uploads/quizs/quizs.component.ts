import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDrawer, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../tab/tab';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../tab/tab.service';
import { SettingsService } from '../../settings/settings.service';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { Subscription } from 'rxjs';
import { TabComponent } from '../../../tab/tab/tab.component';

@Component({
    selector: 'app-quizs',
    templateUrl: './quizs.component.html',
    styleUrls: ['./quizs.component.scss']
})
export class QuizsComponent implements OnInit, OnDestroy {

    @ViewChild('drawer') drawer: MatDrawer;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    quizes: any[] = [];
    quiz: any = null;
    selectedQuiz: any = null;
    quizEventSubscription: Subscription; 

    constructor(
        private toastr: ToastrService,
        private tabService: TabService,
        private dialog: MatDialog,
        private settingsService: SettingsService,
        private connectorService: ConnectorService
    ) { }

    ngOnInit() {
        this.getQuizes();
        this.quizEventSubscription = this.connectorService.currentQuizTab$.subscribe((tab: TabComponent) => {
            if (tab) {
                const id = tab.data.other_id;
                switch (tab.url) {
                    case `settings/quiz/${id}/edit`:
                        this.tabService.closeTab(tab.url);
                        this.getQuizes();
                        break;
                    case `settings/quiz/${id}`:
                        this.tabService.closeTab(tab.url);
                        break;
                }
            }
        });
    }

    ngOnDestroy() {
        this.quizEventSubscription.unsubscribe();
    }

    addQuiz(): void {
        const tab = new Tab(
            'New Quiz',
            'quizTpl',
            `settings/quiz/new`,
            {
                name: 'New Quiz',
                type: 'quiz'
            }
        );
        this.tabService.openTab(tab);
    }
    
    viewQuiz(quiz, event) {
        quiz.isEdit = false;
        quiz.view = 'view';
        const tab = new Tab(
            quiz.rname,
            'quizTpl',
            `settings/quiz/${quiz.other_id}`,
            quiz
        );
        this.tabService.openTab(tab);
    }

    editQuiz(quiz, event: MouseEvent) {
        event.stopPropagation();
        quiz.isEdit = true;
        const tab = new Tab(
            quiz.rname,
            'quizTpl',
            `settings/quiz/${quiz.other_id}/edit`,
            quiz
        );
        this.tabService.openTab(tab);
    }

    async saveQuiz(quiz) {
        try {
            await this.settingsService.saveReport(quiz.id, quiz);
        } catch (e) {
            this.handleError(e);
        }
    }
    
    getQuizes() {
        this.settingsService.getReports('quiz').subscribe(quizes => {
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
    
    
    selectQuiz(quiz) {
        this.selectedQuiz = quiz;
    }
    
    deleteQuiz(id, event: MouseEvent) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    await this.settingsService.deleteReport(id);
                    const index = this.quizes.findIndex(v => v.id === id);
                    if (index > -1) { this.quizes.splice(index, 1); }
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
