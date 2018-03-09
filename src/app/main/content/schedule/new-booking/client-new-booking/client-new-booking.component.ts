import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs'
import { ToastrService } from 'ngx-toastr';

import { ScheduleService } from '../../schedule.service';

class ShiftDate {
    date;
    from;
    to;
    constructor(date = null, from = null, to = null) {
        this.date = date || moment().format('YYYY-MM-DD');
        this.from = from || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
        this.to = to || { hour: 5, minute: 0, meriden: 'PM', format: 12 };
    }

    toString() {
        const start = moment(this.date)
            .startOf('day')
            .hours(hours12to24(this.from.hour, this.from.meriden))
            .minute(this.from.minute)
            .format('YYYY-MM-DD HH:mm:ss');

        const end = moment(this.date)
            .startOf('day')
            .hours(hours12to24(this.to.hour, this.to.meriden))
            .minute(this.to.minute)
            .format('YYYY-MM-DD HH:mm:ss');
        
        return { start, end };
    }
}

class Role {
    num_required;
    name;
    sex;
    constructor(num_required = 1, name = '', sex = 'both') {
        this.num_required = num_required;
        this.name = name;
        this.sex = sex;
    }  
}

function hours12to24(h, meridiem) {
    return h == 12 ? (meridiem.toUpperCase() == 'PM' ? 12 : 0) : (meridiem.toUpperCase() == 'PM' ? h + 12 : h);
}


@Component({
    selector: 'app-client-new-booking',
    templateUrl: './client-new-booking.component.html',
    styleUrls: ['./client-new-booking.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientNewBookingComponent implements OnInit {

    // Booking Parameters
    notes = '';
    title = '';
    location = '';
    address = '';
    contact = '';
    dates = [new ShiftDate()];
    roles = [new Role()];
    workareas = [];

    workareas$;

    readonly SEX = [
        { label: 'Both', value: 'both' },
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' }
    ]

    constructor(
        private toastr: ToastrService,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() {
        this.workareas$ = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };
    }

    addDate() {
        this.dates.push(new ShiftDate());
    }

    removeDate(index) {
        this.dates.splice(index, 1);
    }

    addRole() {
        this.roles.push(new Role());
    }

    removeRole(index) {
        this.roles.splice(index, 1);
    }

    save() {
        // TODO
    }
}
