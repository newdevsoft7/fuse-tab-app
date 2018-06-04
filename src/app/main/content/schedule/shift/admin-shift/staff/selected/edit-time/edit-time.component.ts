import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

class ShiftTime {
    time;

    constructor(sTime) {
        if (!sTime) {
            this.time = { hour: 8, minute: 0, meriden: 'AM', format: 12 }; 
            return;
        };

        const time = moment(sTime, 'h:mm a');
        const minute = time.minute();
        const { hour, meriden } = hours24to12(time.hour());
        
        this.time = { hour, minute, meriden, format: 12 };
    }

    toString() {
        const time = moment({
            hour: hours12to24(this.time.hour, this.time.meriden),
            minute: this.time.minute
        });
        const str = time.format('h:mm a');
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
        this.start = new ShiftTime(this.staff.start);
        this.end = new ShiftTime(this.staff.end);
    }
    
    openForm() {
        this.formActive = true;
    }

    saveForm() {
        const start = this.start.toString();
        const end = this.end.toString();
        this.onTimeChanged.next({ start, end });
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

}

