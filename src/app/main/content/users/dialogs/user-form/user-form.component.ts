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

    readonly types = [
        { label: 'API', value: 'api' },
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Supervisor', value: 'supervisor' },
        { label: 'Staff', value: 'staff' },
        { label: 'Client', value: 'client' }
    ];

    constructor(
        public dialogRef: MatDialogRef<UserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder) {
        this.userFormErrors = {
            lvl: {},
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
            lvl     : ['staff'],
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
