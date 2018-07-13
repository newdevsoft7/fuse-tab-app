import {
    Component, OnInit, Input, ViewEncapsulation
} from '@angular/core';

import { ScheduleService } from '../../../schedule.service';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import * as _ from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../../../tab/tab.service';
import { Tab } from '../../../../../tab/tab';
import { MatDialog } from '@angular/material';
import { ActionService } from '../../../../../../shared/services/action.service';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../../../users/user.service';

class ShiftTime {
    time;

    constructor(hour, minute, meriden) {
        this.time = { hour, minute, meriden, format: 12 };
    }

    toString() {
        const time = moment()
            .startOf('day')
            .hours(hours12to24(this.time.hour, this.time.meriden))
            .minute(this.time.minute);

        return time.format('HH:mm');
    }

}

function hours12to24(h, meriden) {
    return h === 12 ? meriden.toUpperCase() === 'PM' ? 12 : 0 : meriden.toUpperCase() === 'PM' ? h + 12 : h;
}

@Component({
    selector: 'app-edit-shift-role-detail',
    templateUrl: './edit-shift-role-detail.component.html',
    styleUrls: ['./edit-shift-role-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditShiftRoleDetailComponent implements OnInit {

    @Input() shifts;

    roles: any[] = [];
    role;

    payCategories: any[] = [];
    reports$;
    currencies: any[] = [];

    list = {
        num_required: { checked: false, value: 1 },
        rname: { checked: false, value: '' },
        times: {
            checked: false,
            value: {
                same_as_shift: true,
                from: new ShiftTime(8, 0, 'AM'),
                to: new ShiftTime(5, 0, 'PM')
            }
        },
        unpaid_break: { checked: false, value: '' },
        notes: { checked: false, value: ''},
        completion_notes: { checked: false, value: '' },
        expense_limit: { checked: false, value: 1 },
        pay_category_id: { checked: false, value: 'none' },
        bill_rate_group: { checked: false, value: { bill_rate: '', bill_rate_type: 'phr' } },
        pay_rate_group: { checked: false, value: { pay_rate: '', pay_rate_type: 'phr' } },
        bill_travel_group: { checked: false, value: { travel_rate: '', travel_type: 'flat', travel_value: '' } },
        pay_travel_group: { checked: false, value: { travel_rate: '', travel_type: 'flat', travel_value: ''} },
        uploads_required: { checked: false, value: '' },
        requirements: { checked: false, value: [] },
        reports: { checked: false, value: [] },
        bill_currency: { checked: false, value: ''},
        pay_currency: { checked: false, value: ''}
    };

    constructor(
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private toastr: ToastrService,
        private userService: UserService,
        private actionService: ActionService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {

        // Get Role Data
        this.scheduleService.getRoleData(this.shifts.map(v => v.id)).subscribe(res => {
            this.roles = res;
            this.role = this.roles[0];
        });

        // Get currencies
        this.userService.getCurrencies().then(currencies => this.currencies = currencies);

        // Get Pay Categories
        this.scheduleService.getPayLevelCategory().subscribe(res => this.payCategories = res);

        this.reports$ = (text: string): Observable<any> => {
            return this.scheduleService.getReports(text);
        };

    }

    applyRole() {
        let params: any = {
            shift_ids: this.shifts.map(v => v.id),
            rname_to_edit: this.role
        };


        let value;
        // FILTER LIST CHECKED
        const filteredList = Object.keys(this.list).filter(key => this.list[key].checked);
        filteredList.forEach(key => {
            switch (key) {
                case 'times':
                    if (!this.list[key].value.same_as_shift) {
                        params = {
                            ...params,
                            role_start: this.list[key].value.from.toString(),
                            role_end: this.list[key].value.to.toString()
                        };

                    }
                    break;

                case 'reports':
                case 'requirements':
                    value = this.list[key].value.length > 0 ? this.list[key].value : [];
                    params = { ...params, [key]: value.map(v => v.id) };
                    break;

                case 'bill_rate_group':
                    params = {
                        ...params,
                        'bill_rate': this.list[key].value.bill_rate,
                        'bill_rate_type': this.list[key].value.bill_rate_type
                    };
                    break;
                
                case 'pay_rate_group':
                    params = {
                        ...params,
                        'pay_rate': this.list[key].value.pay_rate,
                        'pay_rate_type': this.list[key].value.pay_rate_type
                    };
                    break;
                    
                default: // If key is one of title, location, generic_location, generic_title, address, contact, notes, timezone
                    params = { ...params, [key]: this.list[key].value};
                    break;
            }
        });
        this.scheduleService.updateMultipleRoles(params).subscribe(res => {
            this.toastr.success(res.message);
        }, err => {
            this.toastr.error(err.error.message);
        })
    }

    addNewRole() {
        const shiftIds = _.map(this.shifts, _.property('id'));
        this.openRoleTab(shiftIds);
    }

    deleteRole() {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.scheduleService.deleteShiftRoles({
                        rname: this.role,
                        shift_ids: this.shifts.map(v => +v.id)
                    });
                    this.roles = this.roles.filter(v => v !== this.role);
                    this.actionService.deleteRole$.next(res.deleted_ids);
                } catch (e) {}
            }
        });
    }

    private openRoleTab(shifts) {
        const url = `shift/${shifts.join('-')}/role-edit`;
        const tab = new Tab(
            `Add Role (${shifts.length} ${shifts.length > 1 ? 'shifts' : 'shift'})`,
            'shiftRoleEditTpl',
            url,
            { shifts, url });
        this.tabService.openTab(tab);
    }
}
