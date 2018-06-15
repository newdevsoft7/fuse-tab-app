import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDrawer, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../tab/tab';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../tab/tab.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
    selector: 'app-quizs',
    templateUrl: './quizs.component.html',
    styleUrls: ['./quizs.component.scss']
})
export class QuizsComponent implements OnInit {

    @ViewChild('drawer') drawer: MatDrawer;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    quizes: any[] = [];
    quiz: any = null;
    selectedQuiz: any = null;

    constructor(
        private toastr: ToastrService,
        private tabService: TabService,
        private dialog: MatDialog,
        private settingsService: SettingsService
    ) { }

    ngOnInit() {
        this.getQuizes();
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
    
    async fillQuiz(quiz, event) {
        quiz.isEdit = false;
        const tab = new Tab(
            quiz.rname,
            'quizTpl',
            `settings/quiz/${quiz.id}`,
            quiz
        );
        this.tabService.openTab(tab);
    }
    
    
    async editQuiz(quiz, event: MouseEvent) {
        event.stopPropagation();
        try {
            //const res = await this.settingsService.getQuiz(quiz.id).toPromise();
            quiz.isEdit = true;
            const tab = new Tab(
                quiz.rname,
                'quizTpl',
                `settings/quiz/${quiz.id}`,
                quiz
            );
            this.tabService.openTab(tab);
        } catch (e) {
            this.handleError(e.error);
        }
    }
    
    getQuizes() {
        this.settingsService.getQuizes().subscribe(quizes => {
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
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // TODO - Delete Form
            }
        });
        event.stopPropagation();
      }
    
    handleError(e): void {
        this.toastr.error(e.message || 'Something is wrong');
    }

}
