import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EventEntity } from '@app/core/components/sc-calendar';

@Component({
    selector: 'app-users-profile-calendar-event-form-dialog',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileCalendarEventFormDialogComponent
{
    event: EventEntity;

    constructor(
        public dialogRef: MatDialogRef<UsersProfileCalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any
    )
    {
        this.event = data;
    }
}
