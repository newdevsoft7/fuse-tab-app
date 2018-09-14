import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ScheduleService } from '../../../../../schedule.service';
import { UserService } from '../../../../../../users/user.service';
import { SCMessageService } from '../../../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-admin-shift-change-company-dialog',
    templateUrl: './change-company-dialog.component.html',
    styleUrls: ['./change-company-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftChangeCompanyDialogComponent implements OnInit {

    staff: any;
    outsourceCompanies: any[];
    worksHere;
    loaded = false;

    constructor(
        public dialogRef: MatDialogRef<AdminShiftChangeCompanyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private scheduleService: ScheduleService,
        private userService: UserService,
        private scMessageService: SCMessageService,
    ) {
        this.staff = data.staff;
    }

    async ngOnInit() {

        // Get user outsource companies
        try {
            const res = await this.userService.getUserOutsourceCompanies(this.staff.user_id);
            this.worksHere = res.works_here;
            this.outsourceCompanies = res.data;
        } catch (e) {
            this.scMessageService.error(e);
        } finally {
            this.loaded = true;
        }
    }

    async select(company) {
        try {
            await this.scheduleService.updateRoleStaff(this.staff.id, { outsource_company_id: company ? company.id : null }).toPromise();
            this.dialogRef.close(company ? company.cname : null);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

}
