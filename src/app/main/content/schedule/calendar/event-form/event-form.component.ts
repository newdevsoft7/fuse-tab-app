import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EventEntity } from '../../../../../core/components/sc-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatColors } from '../../../../../core/matColors';

@Component({
    selector     : 'app-schedule-calendar-event-form-dialog',
    templateUrl  : './event-form.component.html',
    styleUrls    : ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarEventFormDialogComponent implements OnInit
{
    event: EventEntity;
    dialogTitle: string;
    eventForm: FormGroup;
    action: string;
    presetColors = MatColors.presets;

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
        }
        else
        {
            this.dialogTitle = 'New Event';
            this.event = new EventEntity();
            this.event.start = data.date.format('YYYY-MM-DD');
            this.event.end = data.date.format('YYYY-MM-DD');
        }

        this.eventForm = this.createEventForm();
    }

    ngOnInit()
    {
    }

    createEventForm()
    {
        return new FormGroup({
            title : new FormControl(this.event.title),
            start : new FormControl(this.event.start),
            end   : new FormControl(this.event.end),
            color : this.formBuilder.group({
                background  : new FormControl(this.event.backgroundColor)
            })
        });
    }
}
