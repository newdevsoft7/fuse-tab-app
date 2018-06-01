import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-set-user-timezone-dialog',
    templateUrl: './set-user-timezone-dialog.component.html',
    styleUrls: ['./set-user-timezone-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SetUserTimezoneDialogComponent implements OnInit {

    timezone;
    timezones: any[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.timezone = data.timezone;
    }

    ngOnInit() { }
}
