import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register-step0',
    templateUrl: './register-step0.component.html',
    styleUrls: ['./register-step0.component.scss']
})
export class RegisterStep0Component implements OnInit {

    form: FormGroup;
    formErrors: any;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.formErrors = {
            fname   : {},
            lname   : {},
            email   : {},
            password: {},
            mob     : {}
        };
    }

    ngOnInit() {

        this.form = this.formBuilder.group({
            fname   : ['', Validators.required],
            lname   : ['', Validators.required],
            email   : ['', Validators.required],
            password: ['', Validators.required],
            mob     : ['', Validators.required]
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
}
