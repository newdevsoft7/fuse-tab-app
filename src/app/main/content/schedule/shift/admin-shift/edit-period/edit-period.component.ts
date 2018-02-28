import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ScheduleService } from '../../../schedule.service';
import { ToastrService } from 'ngx-toastr';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

class ShiftTime {
    date;
    time;

    constructor(dateTime = null) {
        if (!dateTime) {
            const now = new Date();
            const _date = moment(now, 'YYYY-MM-DD HH:mm:ss');
            this.date = moment(now, 'YYYY-MM-DD');
            this.time = { hour: 8, minute: 0, meriden: 'AM', format: 12 };
            return;
        };

        const _date = moment(dateTime, 'YYYY-MM-DD HH:mm:ss');
        const minute = _date.minute();
        const { hour, meriden } = hours24to12(_date.hour());

        this.date = moment(dateTime, 'YYYY-MM-DD');
        this.time = { hour, minute, meriden, format: 12 };
    }

    toString() {
        const date = moment(this.date, 'YYYY-MM-DD');
        const year = date.year();
        const month = date.month();
        const day = date.date();

        const time = moment({
            year, month, day,
            hour: hours12to24(this.time.hour, this.time.meriden),
            minute: this.time.minute
        });
        const str = time.format('YYYY-MM-DD HH:mm:ss');
        return str;
    }

}

function hours12to24(h, meriden) {
    return h === 12 ? meriden.toUpperCase() === 'PM' ? 12 : 0 : meriden.toUpperCase() === 'PM' ? h + 12 : h;
}

function hours24to12(h) {
    return {
        hour: (h + 11) % 12 + 1,
        meriden: h >= 12 ? 'PM' : 'AM'
    }
}

function minutesWithLeadingZeros(minutes) {
    return (minutes < 10 ? '0' : '') + minutes;
}

@Component({
    selector: 'app-admin-shift-edit-period',
    templateUrl: './edit-period.component.html',
    styleUrls: ['./edit-period.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AdminShiftEditPeriodComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() shift;
    @Input() timezones = [];
    @Output() onPeriodChanged = new EventEmitter;

    dateChanged = false;

    start;  // START TIME
    end;    // END TIME

    constructor(
        private formBuilder: FormBuilder,
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.start = new ShiftTime(this.shift.shift_start);
        this.end = new ShiftTime(this.shift.shift_end);
    }

    getTimezone() {
        const timezone = this.timezones.find(t => t.value === this.shift.timezone);
        return timezone ? timezone.label : '';
    }

    openForm() {
        this.form = this.formBuilder.group({
            date: [moment(this.shift.shift_start).toDate(), Validators.required],
            timezone: [this.shift.timezone, Validators.required]
        });
        this.formActive = true;
    }

    saveForm() {
        if (!this.form.valid || !this.validatePeriod()) return;
        const date = moment(this.form.getRawValue().date).format('YYYY-MM-DD');
        const start = moment(`${date} ${moment(this.start.toString()).format('HH:mm:ss')}`).format('YYYY-MM-DD HH:mm:ss');
        const end = moment(`${date} ${moment(this.end.toString()).format('HH:mm:ss')}`).format('YYYY-MM-DD HH:mm:ss');
        const timezone = this.form.getRawValue().timezone;

        this.scheduleService.updateShift(this.shift.id, { timezone, shift_start: start, shift_end: end })
            .subscribe(res => {
                this.onPeriodChanged.next({ start, end, timezone });
                this.toastr.success(res.message);
            })
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

    private validatePeriod() {
        if (this.start.time.hour === '' ||
            this.end.time.hour === '' ||
            (this.start.time.meriden === 'PM' && this.end.time.meriden === 'AM')) { return false; }

        if (this.start.time.meriden === this.end.time.meriden) {
            return this.start.time.hour < this.end.time.hour ? true :
                (this.start.time.hour === this.end.time.hour ? (this.start.time.minute < this.end.time.minute ? true : false) : false);
        }

        return true;
    }

}
