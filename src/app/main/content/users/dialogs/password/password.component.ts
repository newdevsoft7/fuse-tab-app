import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-password-dialog',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserPasswordDialogComponent implements OnInit {

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UserPasswordDialogComponent>,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', Validators.required],
        });
    }

    onSave() {
        const password = this.form.getRawValue().password;
        this.dialogRef.close(password);
    }
}
