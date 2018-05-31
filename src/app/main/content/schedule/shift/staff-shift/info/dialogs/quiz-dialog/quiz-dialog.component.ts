import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TokenStorage } from '../../../../../../../../shared/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../../../../schedule.service';
import { TabService } from '../../../../../../../tab/tab.service';
import { Tab } from '../../../../../../../tab/tab';

@Component({
    selector: 'app-staff-shift-quiz-dialog',
    templateUrl: './quiz-dialog.component.html',
    styleUrls: ['./quiz-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
    
})
export class StaffShiftQuizDialogComponent implements OnInit {

    quizs: any[] = [];
    role: any;

    constructor(
        public dialogRef: MatDialogRef<StaffShiftQuizDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private tabService: TabService
    ) {
        this.quizs = data.quizs;
        this.role = data.role;
    }

    ngOnInit() {
    }

    openQuiz(quiz) {
        const tab = new Tab(
            quiz.rname,
            'quizTpl',
            `staff-shift/quiz/${quiz.id}`,
            {
                role: this.data.role,
                ...quiz
            }
        );
        this.tabService.openTab(tab);
        this.dialogRef.close();
    }

}
