import {
    Component, OnInit,
    ViewEncapsulation, Input,
    DoCheck, IterableDiffers,
    Output, EventEmitter,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';
import { TabService } from '../../../../../../tab/tab.service';
import { UserService } from '../../../../../users/user.service';
import { ScheduleService } from '../../../../schedule.service';

import * as _ from 'lodash';
import * as moment from 'moment';

import { FuseConfirmDialogComponent } from '../../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../../../../tab/tab';
import { StaffStatus } from '../../../../../../../constants/staff-status-id';
import {
    STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
    STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY, STAFF_STATUS_CONFIRMED,
    STAFF_STATUS_CHECKED_IN, STAFF_STATUS_CHECKED_OUT, STAFF_STATUS_COMPLETED,
    STAFF_STATUS_INVOICED, STAFF_STATUS_PAID, STAFF_STATUS_NO_SHOW
} from '../../../../../../../constants/staff-status';
import { DatatableComponent } from '@swimlane/ngx-datatable';

enum Query {
    Counts = 'counts',
    Selected = 'selected',
    Standby = 'standby',
    Applicants = 'applicants',
    Na = 'na'
};

@Component({
    selector: 'app-admin-shift-staff-selected',
    templateUrl: './selected.component.html',
    styleUrls: ['./selected.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffSelectedComponent implements OnInit, DoCheck {

    @Input() editable;

    @ViewChild('tableWrapper') tableWrapper;
    @ViewChild('table') table: DatatableComponent;
    private currentComponentWidth;

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

    @Input() showBillInfo = 0;

    public StaffStatus = StaffStatus;

    @Output() onStaffCountChanged = new EventEmitter();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private loadingService: CustomLoadingService,
        private tabService: TabService,
        private userService: UserService,
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private changeDetectorRef: ChangeDetectorRef,
        differs: IterableDiffers
    ) {
    }

    ngAfterViewChecked() {
        // Check if the table size has changed,
        if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
            this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
            this.table.recalculate();
            this.changeDetectorRef.detectChanges();
        }
    }

    ngOnInit() {
    }

    ngDoCheck() {
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
                        this.toastr.success(res.message);
                        this.scheduleService.getRoleStaffs(staff.shift_role_id, Query.Selected)
                            .subscribe(res => {
                                this.staffs = res.role_staff;
                            })
                        this.updateStaffCount();
                    });
            }
        });
    }

    onTimeChanged(event, staff) {
        staff.staff_start = event.start;
        staff.staff_end = event.end;

        const staff_start = moment(staff.staff_start).format('HH:mm');
        const staff_end = moment(staff.staff_end).format('HH:mm');

        this.scheduleService.updateRoleStaff(staff.id, { staff_start, staff_end })
            .subscribe(res => {
                this.toastr.success(res.message);
            });
    }

    OnBreakChanged(value, staff) {
        this.scheduleService.updateRoleStaff(staff.id, { unpaid_break: value })
            .subscribe(res => {
                this.toastr.success(res.message);
                staff.unpaid_break = value;
            });
    }

    onPayItemsChanged(event, staff) {
        const pay_rate = event.payRate;
        const pay_rate_type = event.payRateType;
        this.scheduleService.updateRoleStaff(staff.id, { pay_rate, pay_rate_type })
            .subscribe(res => {
                this.toastr.success(res.message);
                staff.pay_rate = pay_rate;
                staff.pay_rate_type = pay_rate_type;
            });
    }

    onBillItemsChanged(event, staff) {
        const bill_rate = event.billRate;
        const bill_rate_type = event.billRateType;
        this.scheduleService.updateRoleStaff(staff.id, { bill_rate, bill_rate_type })
            .subscribe(res => {
                this.toastr.success(res.message);
                staff.bill_rate = bill_rate;
                staff.bill_rate_type = bill_rate_type;
            });
    }

    private updateStaffCount() {
        this.onStaffCountChanged.next(true);
    }

    changeTimesLock(staff) {
        const times_locked = staff.times_locked === 1 ? 0 : 1;
        this.scheduleService.updateRoleStaff(staff.id, { times_locked })
            .subscribe(res => {
                staff.times_locked = times_locked;
                this.toastr.success(res.message);
            });
    }

    toggleTeamLeader(staff) {
        const team_leader = staff.team_leader === 1 ? 0 : 1;
        this.scheduleService.updateRoleStaff(staff.id, { team_leader })
            .subscribe(res => {
                staff.team_leader = team_leader;
                this.toastr.success(res.message);
            });
    }


}
