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

import * as _ from 'lodash';
import { Tab } from '../../../../../../tab/tab';
import { StaffStatus } from '../../../../../../../constants/staff-status-id';

@Component({
    selector: 'app-admin-shift-staff-selected',
    templateUrl: './selected.component.html',
    styleUrls: ['./selected.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffSelectedComponent implements OnInit, DoCheck {

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

    public StaffStatus = StaffStatus;

    constructor(
        private loadingService: CustomLoadingService,
        private tabService: TabService,
        private userService: UserService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
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

    changeTimesLock(staff) {
        staff.times_locked = staff.times_locked === 1 ? 0 : 1;
        // TODO
    }


}
