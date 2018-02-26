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

import { STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_SELECTED, STAFF_STATUS_REJECTED, STAFF_STATUS_STANDBY } from '../../../../../../../constants/staff-status';

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

    select(staff) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Really select this applicant?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.scheduleService.assignStaffToRole(staff.user_id, staff.shift_role_id, STAFF_STATUS_SELECTED)
                    .subscribe(res => {
                        this.staffs = this._staffs.filter(v => v.id !== staff.id);
                        this.updateStaffCount();
                    });
            }
        });
    }


}
