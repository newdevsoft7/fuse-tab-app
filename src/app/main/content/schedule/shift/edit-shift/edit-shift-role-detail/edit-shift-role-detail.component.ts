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

        return time.format('YYYY-MM-DD HH:mm:ss');
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
        requirements: { checked: false, value: [] }
    };

    constructor(
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {

        // Get Role Data
        this.scheduleService.getRoleData(this.shifts.map(v => v.id)).subscribe(res => {
            this.roles = res.roles;
            this.role = this.roles[0];
        });

        // Get Pay Categories
        this.scheduleService.getPayLevelCategory().subscribe(res => this.payCategories = res);
    }

    applyRole() {
    }

    addNewRole() {
        const shiftIds = _.map(this.shifts, _.property('id'));
        this.openRoleTab(shiftIds);
    }

    deleteRole() {
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
