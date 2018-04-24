import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-group-dialog',
    templateUrl: './group-dialog.component.html',
    styleUrls: ['./group-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupDialogComponent implements OnInit {

    form: FormGroup;
    formErrors: any;

    constructor(
        public dialogRef: MatDialogRef<GroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder
    ) {
        this.formErrors = {
            gname: {}
        };
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            gname: ['', Validators.required],
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

    onSave() {
        const gname = this.form.getRawValue().gname;
        this.dialogRef.close(gname);
    }

}
