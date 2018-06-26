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
    reports: any[] = [];
    uploads_required: number;
    num_uploaded: number;

    constructor(
        public dialogRef: MatDialogRef<StaffShiftCompleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private tabService: TabService
    ) {
        this.settings = this.tokenStorage.getSettings();
        
    }

    ngOnInit() {
        this.completeCheck();
    }

    async completeCheck() {
        try {
            const { reports, uploads_required, num_uploaded } = await this.scheduleService.completeCheck(this.data.roleStaffId);
            this.reports = reports;
            this.uploads_required = uploads_required;
            this.num_uploaded = num_uploaded;
        } catch (e) {
            this.toastr.error(e.error.message || 'Something is wrong!')
        }
    }

    onComplete() {
        this.dialogRef.close(true);
    }

    openReport(report) {
        const tab = new Tab(
            report.rname,
            'quizTpl',
            `staff-shift/reports/${report.other_id}`,
            {
                action: this.data.action,
                role: this.data.role,
                ...report
            }
        );
        this.tabService.openTab(tab);
        this.dialogRef.close();
    }

}
