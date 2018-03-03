import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-staff-shift-replace-dialog',
    templateUrl: './replace-dialog.component.html',
    styleUrls: ['./replace-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftReplaceDialogComponent implements OnInit {

    form: FormGroup;
    formErrors: any;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<StaffShiftReplaceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.formErrors = {
            reason: {}
        };
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            reason: ['', Validators.required]
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    saveForm() {
        if (this.form.valid) {
            const reason = this.form.getRawValue().reason;
            this.dialogRef.close(reason);
        }
    }

    onFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

}
