import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-staff-shift-complete-dialog',
    templateUrl: './complete-dialog.component.html',
    styleUrls: ['./complete-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftCompleteDialogComponent implements OnInit {

    notes: string;

    constructor(
        public dialogRef: MatDialogRef<StaffShiftCompleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit() {
    }

    onComplete() {
        const body = { notes: this.notes };
        this.dialogRef.close(body);
    }

}
