import {
    Component, OnInit,
    ViewEncapsulation, Input,
    DoCheck, IterableDiffers,
    Output, EventEmitter
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';
import { TabService } from '../../../../../../tab/tab.service';
import { UserService } from '../../../../../users/user.service';
import { ScheduleService } from '../../../../schedule.service';

import * as _ from 'lodash';
import { FuseConfirmDialogComponent } from '../../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../../../../tab/tab';

import {
    STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
    STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY, STAFF_STATUS_CONFIRMED,
    STAFF_STATUS_CHECKED_IN, STAFF_STATUS_CHECKED_OUT, STAFF_STATUS_COMPLETED,
    STAFF_STATUS_INVOICED, STAFF_STATUS_PAID, STAFF_STATUS_NO_SHOW
} from '../../../../../../../constants/staff-status';

enum Query {
    Counts = 'counts',
    Selected = 'selected',
    Standby = 'standby',
    Applicants = 'applicants',
    Na = 'na'
};

@Component({
    selector: 'app-admin-shift-staff-na',
    templateUrl: './na.component.html',
    styleUrls: ['./na.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffNAComponent implements OnInit, DoCheck {

    _staffs;

    @Input()
    get staffs() {
        return this._staffs;
    }

    @Output() staffsChange = new EventEmitter();
    set staffs(staffs) {
        this._staffs = staffs;
        this.staffsChange.emit(staffs);
    }

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @Output() onStaffCountChanged = new EventEmitter();

    constructor(
        private loadingService: CustomLoadingService,
        private tabService: TabService,
        private userService: UserService,
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
    }

    getAvatar(value) {
        switch (value) {
            case 'male_tthumb.jpg':
            case 'female_tthumb.jpg':
            case 'nosex_tthumb.jpg':
                return `/assets/images/avatars/${value}`;
            default:
                return value;
        }
    }

    openUser(staff, event: Event) {
        event.stopPropagation();
        this.userService.getUser(staff.user_id)
            .subscribe(res => {
                const user = res;
                const tab = new Tab(`${user.fname} ${user.lname}`, 'usersProfileTpl', `users/user/${user.id}`, user);
                this.tabService.openTab(tab);
            });
    }

    ngOnInit() {
    }

    ngDoCheck() {
    }

    private updateStaffCount() {
        this.onStaffCountChanged.next(true);
    }

    changeStatus(staff, statusId) {
        let message = "";

        switch (statusId) {
            case STAFF_STATUS_SELECTED:
                message = 'Really select this applicant?';
                break;

            case STAFF_STATUS_APPLIED:
                message = 'Really put this applicant on applied?';
                break;

            case STAFF_STATUS_STANDBY:
                message = 'Really put this applicant on standby?';
                break;

            case STAFF_STATUS_HIDDEN_REJECTED:
                message = 'Really hidden reject this applicant?';
                break;

            case STAFF_STATUS_REJECTED:
                message = 'Really reject this applicant?';
                break;

            default:
                message = 'Really update this applicant?';
                break;
        }

        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = message;

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.scheduleService.updateRoleStaff(staff.id, { staff_status_id: statusId })
                    .subscribe(res => {
                        this.scheduleService.getRoleStaffs(staff.shift_role_id, Query.Na)
                            .subscribe(res => {
                                this.staffs = res.role_staff;
                            })
                        this.updateStaffCount();
                    });
            }
        });
    }

    

}
