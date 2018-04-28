import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EventEntity } from '../../../../../core/components/sc-calendar';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-schedule-calendar-event-form-dialog',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarEventFormDialogComponent
{
    event: EventEntity;

    constructor(
        public dialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    )
    {
        this.event = data;
    }
}
