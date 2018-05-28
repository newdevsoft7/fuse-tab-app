import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TokenStorage } from '../../../../../../../../shared/services/token-storage.service';

@Component({
    selector: 'app-staff-shift-complete-dialog',
    templateUrl: './complete-dialog.component.html',
    styleUrls: ['./complete-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftCompleteDialogComponent implements OnInit {

    notes: string;
    settings: any;

    constructor(
        public dialogRef: MatDialogRef<StaffShiftCompleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokenStorage: TokenStorage
    ) {
        this.settings = this.tokenStorage.getSettings();
    }

    ngOnInit() {
    }

    onComplete() {
        const body = { notes: this.notes };
        this.dialogRef.close(body);
    }

}
