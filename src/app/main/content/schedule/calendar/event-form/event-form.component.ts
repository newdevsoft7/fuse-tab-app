import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EventEntity } from '../../../../../core/components/sc-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatColors } from '../../../../../core/matColors';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ValidateStartDatetime, ValidateTimeFormat, ValidateEndDatetime } from './event-form.validator';

@Component({
    selector: 'app-schedule-calendar-event-form-dialog',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarEventFormDialogComponent implements OnInit
{
    event: EventEntity;
    dialogTitle: string;
    eventForm: FormGroup;
    action: string;
    presetColors = MatColors.presets;

    start: { date?: string, time?: string } = {};
    end: { date?: string, time?: string } = {};

    constructor(
        public dialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.event = data.event;
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = this.event.title;
            this.start.date = moment(this.event.start).format('YYYY-MM-DD');
            this.start.time = moment(this.event.start).format('HH:mm');
            if (this.event.end) {
                this.end.date = moment(this.event.end).format('YYYY-MM-DD');
                this.end.time = moment(this.event.end).format('HH:mm');
            }
        }
        else
        {
            this.dialogTitle = 'New Event';
            this.event = new EventEntity();
            this.start.date = data.date.format('YYYY-MM-DD');
            this.end.date = data.date.format('YYYY-MM-DD');
        }

        this.eventForm = this.createEventForm();
    }

    ngOnInit() {}

    get startMask(): any {
      const time = this.eventForm.get(['start', 'time']).value;
      return {
        mask: [/[0-2]/, time && parseInt(time[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /[0-9]/]
      };
    }

    get endMask(): any {
      const time = this.eventForm.get(['end', 'time']).value;
      return {
        mask: [/[0-2]/, time && parseInt(time[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /[0-9]/]
      };
    }

    createEventForm()
    {
        return new FormGroup({
            title : new FormControl(this.event.title),
            start: this.formBuilder.group({
              date: new FormControl(this.start.date),
              time: new FormControl(this.start.time, [ValidateTimeFormat, ValidateStartDatetime])
            }),
            end: this.formBuilder.group({
              date: new FormControl(this.end.date),
              time: new FormControl(this.end.time, [ValidateTimeFormat, ValidateEndDatetime])
            }),
            backgroundColor  : new FormControl(this.event.eventBackgroundColor)
        });
    }
}
