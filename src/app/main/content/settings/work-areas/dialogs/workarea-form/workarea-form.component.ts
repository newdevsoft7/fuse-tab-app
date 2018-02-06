import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector     : 'app-settings-work-areas-form-dialog',
    templateUrl  : './workarea-form.component.html',
    styleUrls    : ['./workarea-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class WorkAreaFormDialogComponent implements OnInit
{
    workareaForm: FormGroup;
    workAreaFormErrors: any;
    categories: any[];
    timezones: any[];
    workarea: any;

    constructor(
        public dialogRef: MatDialogRef<WorkAreaFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder) {
        this.workAreaFormErrors = {
            aname: {},
            work_area_cat_id: {},
            php_tz: {}
        };
        this.workarea = data.workarea;
        this.categories = data.categories;
        this.timezones = data.timezones;
    }

    ngOnInit() {
        this.workareaForm = this.formBuilder.group({
            aname   : ['', Validators.required],
            work_area_cat_id   : ['', Validators.required],
            php_tz     : ['', Validators.required]
        });

        this.workareaForm.valueChanges.subscribe(() => {
            this.onWorkAreaFormValuesChanged();
        });
    }

    
    onWorkAreaFormValuesChanged() {
        for (const field in this.workAreaFormErrors) {
            if (!this.workAreaFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.workAreaFormErrors[field] = {};

            // Get the control
            const control = this.workareaForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.workAreaFormErrors[field] = control.errors;
            }
        }
    }

    onSave() {        
        const workArea = { ...this.workareaForm.value, id: this.workarea.id };
        console.log(workArea);
        this.dialogRef.close(workArea);
    }
}
