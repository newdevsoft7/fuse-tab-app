import {
    Component, OnInit,
    ViewEncapsulation, Input,
    Output, EventEmitter,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { OnRatingChangeEven } from 'angular-star-rating';

import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';
import { TabService } from '../../../../../../tab/tab.service';
import { UserService } from '../../../../../users/user.service';
import { ScheduleService } from '../../../../schedule.service';

import * as _ from 'lodash';
import * as moment from 'moment';

import { FuseConfirmDialogComponent } from '../../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../../../../tab/tab';
import {
    STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
    STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY, STAFF_STATUS_CONFIRMED,
    STAFF_STATUS_CHECKED_IN, STAFF_STATUS_CHECKED_OUT, STAFF_STATUS_COMPLETED,
    STAFF_STATUS_INVOICED, STAFF_STATUS_PAID, STAFF_STATUS_NO_SHOW
} from '../../../../../../../constants/staff-status';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AddPayItemDialogComponent } from './add-pay-item-dialog/add-pay-item-dialog.component';
import { TokenStorage } from '../../../../../../../shared/services/token-storage.service';
import { AuthenticationService } from '../../../../../../../shared/services/authentication.service';

enum Query {
    Counts = 'counts',
    Selected = 'selected',
    Standby = 'standby',
    Applicants = 'applicants',
    Invited = 'invited',
    Na = 'na'
}

@Component({
    selector: 'app-admin-shift-staff-selected',
    templateUrl: './selected.component.html',
    styleUrls: ['./selected.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffSelectedComponent implements OnInit {

    @Input() editable;
    @Input() shift;

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

    @Output() onStaffCountChanged = new EventEmitter();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private spinner: CustomLoadingService,
        private tabService: TabService,
        private userService: UserService,
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private authService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.staffs.map(s => {
            s.pay_items_show === false;
            s.pay_items = s.pay_items ? s.pay_items : []
        });
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

    async loginAsUser(staff: any) {
        try {
            const res = await this.authService.loginAs(staff.user_id);
            this.toastr.success(res.message);
            this.tokenStorage.setSecondaryUser(res.user);
            this.tokenStorage.userSwitchListener.next(true);
            if (res.user.lvl.startsWith('registrant')) {
                const currentStep = this.authService.getCurrentStep();
                this.router.navigate(['/register', currentStep]);
            }
        } catch (e) {
            this.toastr.error((e.error ? e.error.message : e.message) || 'Something is wrong');
        }
    }

    addPayItem(staff) {
        const dialogRef: MatDialogRef<AddPayItemDialogComponent> =
            this.dialog.open(AddPayItemDialogComponent, {
                disableClose: false,
                panelClass: 'add-pay-item-dialog',
                data: {
                    show_bill: this.showBillInfo
                }
            });

        dialogRef.afterClosed().subscribe(async (data) => {
            if (data !== false) {
                try {
                    data = {
                        ...data,
                        role_staff_id: staff.id
                    };
                    const res = await this.scheduleService.addPayItem(data);
                    const item = {
                        ...res.data,
                        type: 'staff'
                    };
                    staff.pay_items.push(item);
                    this.toastr.success(res.message);
                    this.recalcuatePayItemsTotal(staff);
                } catch (e) {
                    this.toastr.error(e.error.message);
                }
            }
        });
    }

    async removePayItem(staff, payItem) {
        if (payItem.type === 'role') {
            this.toastr.error('This is a role pay item and must be deleted from the role.');
            return;
        } else {
            try {
                const res = await this.scheduleService.deletePayItem(payItem.id);
                this.toastr.success(res.message);
                const index = staff.pay_items.findIndex(p => p.id === payItem.id);
                if (index > -1) {
                    staff.pay_items.splice(index, 1);
                }
                this.recalcuatePayItemsTotal(staff);
            } catch (e) {
                this.toastr.error(e.error.message);
            }
        }
    }

    togglePayItemsView(staff) {
        staff.pay_items_show = staff.pay_items_show ? false : true;
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
        staff.start = event.start;
        staff.end = event.end;

        const start = moment(staff.start, 'hh:mm a');
        const end = moment(staff.end, 'hh:mm a');

        const duration = moment.duration(end.diff(start));
        staff.hours = _.round(duration.asHours(), 2);

        this.scheduleService.updateRoleStaff(staff.id, {
            staff_start: start.format('HH:mm'),
            staff_end: end.format('HH:mm')
        }).subscribe(res => {
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

    recalcuatePayItemsTotal(staff) {
        staff.pay_items_total = staff.pay_items.reduce((s, v) => s + v.units * v.unit_rate, 0);
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

    async changeRate(event: OnRatingChangeEven, staff) {
        const score = event.rating;
        try {
            const res = await this.scheduleService.updateRoleStaff(staff.id, { rating: score }).toPromise();
            staff.rating = score;
        } catch (e) {
            this.displayError(e);
        }
    }

    async resetRate(staff) {
        try {
            const res = await this.scheduleService.updateRoleStaff(staff.id, { rating: 0 }).toPromise();
            staff.rating = 0;
        } catch (e) {
            this.displayError(e);
        }
    }

    async setLate(isLate: boolean, staff) {
        try {
            const res = await this.scheduleService.updateRoleStaff(staff.id, { late: isLate ? 1 : 0 }).toPromise();
        } catch (e) {
            this.displayError(e);
        }
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }
}
