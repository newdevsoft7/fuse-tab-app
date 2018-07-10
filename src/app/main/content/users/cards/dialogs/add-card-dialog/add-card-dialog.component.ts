import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-users-add-card-dialog',
    templateUrl: './add-card-dialog.component.html',
    styleUrls: ['./add-card-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersAddCardDialogComponent implements OnInit {

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UsersAddCardDialogComponent>,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }

    save() {
        if (this.form.valid) {
            const name = this.form.getRawValue().name;
            this.dialogRef.close(name);
        }
    }

}
