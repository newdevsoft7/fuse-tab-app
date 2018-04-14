import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';

enum Recurring {
    Weekly,
    None
}

class UTime {
    time;
    constructor(time?) {
        this.time = time || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
    }
}

@Component({
    selector: 'app-add-unavailability-dialog',
    templateUrl: './add-unavailability-dialog.component.html',
    styleUrls: ['./add-unavailability-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddUnavailabilityDialogComponent implements OnInit {

    recurring: Recurring;
    fromDate: any;
    toDate: any;
    fromTime: any;
    toTime: any;
    title: string;
    weekday;

    weekdays: any[] = [
        { value: 1, label: 'Sunday' },
        { value: 2, label: 'Monday' },
        { value: 3, label: 'Tuesday' },
        { value: 4, label: 'Wednesday' },
        { value: 5, label: 'Thursday' },
        { value: 6, label: 'Friday' },
        { value: 7, label: 'Saturday' },
    ];

    readonly Recurring = Recurring;

    constructor(
        public dialogRef: MatDialogRef<AddUnavailabilityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.reset();
    }

    save() {
        let param: any = {
            title: this.title
        };
        if (this.recurring !== Recurring.Weekly) {
            param = {
                ...param,
                start: moment(this.fromDate).format('YYYY-MM-DD'),
                end: moment(this.toDate).format('YYYY-MM-DD')
            };
        } else {
            param = {
                ...param,
                weekday: this.weekday,
                start: convertDateTime(this.fromDate, this.fromTime.time),
                end: convertDateTime(this.toDate, this.toTime.time)
            };
        }
        this.dialogRef.close(param);
    }

    get valid() {
        if (!this.title) { return false; }
        if (moment(this.fromDate).isAfter(moment(this.toDate))) { return false; }
        if (this.recurring === Recurring.Weekly) {
            const from = moment({
                hour: hours12to24(this.fromTime.time.hour, this.fromTime.time.meriden),
                minute: this.fromTime.time.minute
            });
            const to = moment({
                hour: hours12to24(this.toTime.time.hour, this.toTime.time.meriden),
                minute: this.toTime.time.minute
            });
            return from.isBefore(to);
        } else {
            return true;
        }
    }

    reset() {
        this.fromDate = moment().format('YYYY-MM-DD');
        this.toDate = moment().add(1, 'months').format('YYYY-MM-DD');
        this.recurring = Recurring.Weekly;
        this.title = '';
        this.fromTime = new UTime();
        this.toTime = new UTime({ hour: 5, minute: 0, meriden: 'PM', format: 12 });
        this.weekday = 1;
    }

}

function convertDateTime(date, time): string {
    date = moment(date);
    const year = date.year();
    const month = date.month();
    const day = date.date();
    const hour = hours12to24(time.hour, time.meriden);
    const minute = time.minute;
    const result = moment({
        year, month, day, hour, minute
    }).format('YYYY-MM-DD HH:mm:ss');
    return result;
}


function hours12to24(h, meridiem) {
    return h === 12 ? (meridiem.toUpperCase() === 'PM' ? 12 : 0) : (meridiem.toUpperCase() === 'PM' ? h + 12 : h);
}
