import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-pin-post-dialog',
    templateUrl: './pin-post-dialog.component.html',
    styleUrls: ['./pin-post-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PinPostDialogComponent implements OnInit {

    form: FormGroup;
    formErrors: any;

    constructor(
        public dialogRef: MatDialogRef<PinPostDialogComponent>,
        private formBuilder: FormBuilder
    ) {
        this.formErrors = {
            title: {}
        };
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required]
        });

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
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

    saveForm() {
        const title = this.form.getRawValue().title;
        this.dialogRef.close(title);
    }


}
