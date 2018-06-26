import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TokenStorage } from '../../../../../../../../shared/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../../../../schedule.service';
import { TabService } from '../../../../../../../tab/tab.service';
import { Tab } from '../../../../../../../tab/tab';

@Component({
    selector: 'app-staff-shift-complete-dialog',
    templateUrl: './complete-dialog.component.html',
    styleUrls: ['./complete-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftCompleteDialogComponent implements OnInit {

    settings: any;
    uploads_required: number;
    num_uploaded: number;
    role: any;

    constructor(
        public dialogRef: MatDialogRef<StaffShiftCompleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private tabService: TabService
    ) {
        this.settings = this.tokenStorage.getSettings();
        this.role = data.role;
    }

    ngOnInit() {
        this.completeCheck();
    }

    async completeCheck() {
        try {
            const { reports, uploads_required, num_uploaded } = await this.scheduleService.completeCheck(this.data.roleStaffId);
            this.uploads_required = uploads_required;
            this.num_uploaded = num_uploaded;
        } catch (e) {
            this.toastr.error(e.error.message || 'Something is wrong!')
        }
    }

    onComplete() {
        this.dialogRef.close(true);
    }

    openSurvey(survey) {
        let tab: any;
        if (survey.completed_id == null) {
            survey.view = 'customdata';
            tab = new Tab(
                survey.rname,
                'quizTpl',
                `staff-shift/reports/${survey.id}`,
                {
                    // action: this.data.action,
                    role: this.data.role,
                    ...survey
                }
            );

        } else {
            survey.view = 'contentedit';
            tab = new Tab(
                survey.rname,
                'quizTpl',
                `staff-shift/reports/${survey.id}`,
                {
                    // action: this.data.action,
                    role: this.data.role,
                    ...survey,
                    other_id: survey.completed_id
                }
            );
        }
        
        this.tabService.openTab(tab);
        this.dialogRef.close();
    }

}
