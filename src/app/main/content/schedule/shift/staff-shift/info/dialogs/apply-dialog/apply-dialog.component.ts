import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TokenStorage } from '../../../../../../../../shared/services/token-storage.service';

@Component({
	selector: 'app-staff-shift-apply-dialog',
	templateUrl: './apply-dialog.component.html',
    styleUrls: ['./apply-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftApplyDialogComponent implements OnInit {

    form: FormGroup;
    settings: any = {};
    placeholder = '';

	constructor(
        private tokenStorage: TokenStorage,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<StaffShiftApplyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.settings = this.tokenStorage.getSettings();
    }

	ngOnInit() {
        this.form = this.formBuilder.group({
            reason: ['']
        });

    }

    saveForm() {
        const reason = this.form.getRawValue().reason;
        if (this.settings.shift_application_reason === '1' && reason === '') {
            return;
        } else {
            this.dialogRef.close(reason);
        }
    }

}
