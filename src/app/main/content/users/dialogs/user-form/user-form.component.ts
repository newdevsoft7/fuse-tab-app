import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector     : 'app-users-user-form-dialog',
    templateUrl  : './user-form.component.html',
    styleUrls    : ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UserFormDialogComponent implements OnInit
{
    userForm: FormGroup;
    userFormErrors: any;

    constructor(
        public dialogRef: MatDialogRef<UserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder) {
        this.userFormErrors = {
            fname: {},
            lname: {},
            sex: {},
            email: {},
            mob: {},
            password: {}
        };
    }

    ngOnInit() {
        this.userForm = this.formBuilder.group({
            fname   : ['', Validators.required],
            lname   : ['', Validators.required],
            sex     : ['', Validators.required],
            email   : ['', [Validators.required, Validators.email]],
            mob     : ['', Validators.required],
            password: ['', Validators.required],
            welcome_email: [true]
        });

        this.userForm.valueChanges.subscribe(() => {
            this.onUserFormValuesChanged();
        });
    }

    onUserFormValuesChanged() {
        for (const field in this.userFormErrors) {
            if (!this.userFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.userFormErrors[field] = {};

            // Get the control
            const control = this.userForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.userFormErrors[field] = control.errors;
            }
        }
    }

    onSave() {
        const user = this.userForm.value;
        delete user.welcome_email;
        // user.welcome_email = user.welcome_email ? 1 : 0;
        this.dialogRef.close(user);
    }
}
