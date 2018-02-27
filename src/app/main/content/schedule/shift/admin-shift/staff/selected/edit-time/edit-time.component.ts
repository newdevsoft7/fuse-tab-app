import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

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
    selector: 'app-admin-shift-edit-time',
    templateUrl: './edit-time.component.html',
    styleUrls: ['./edit-time.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftEditTimeComponent implements OnInit {

    formActive = false;
    @Input() staff;
    @Input() editable;

    @Output() onTimeChanged = new EventEmitter;

    start;
    end;

    constructor() { }

    ngOnInit() {
        this.start = new ShiftTime(this.staff.staff_start);
        this.end = new ShiftTime(this.staff.staff_end);
    }

    display(dateTime = null) {
        if (!dateTime) return 'TBA';

        const _date = moment(dateTime, 'YYYY-MM-DD hh:mm:ss');
        const minute = _date.minutes();
        const { hour, meriden } = hours24to12(_date.hour());
        return `${hour}:${minutesWithLeadingZeros(minute)} ${meriden}`;
    }
    
    openForm() {
        this.formActive = true;
    }

    saveForm() {
        if (!this.validate()) return;
        const start = this.start.toString();
        const end = this.end.toString();
        this.onTimeChanged.next({ start, end });
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

    private validate() {
            if (this.start.date > this.end.date ) return false;

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

