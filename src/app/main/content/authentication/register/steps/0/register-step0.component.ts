import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RegisterService } from "../../register.service";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { AuthenticationService } from "../../../../../../shared/services/authentication.service";
import { AppSettingService } from "../../../../../../shared/services/app-setting.service";
import { SCMessageService } from "../../../../../../shared/services/sc-message.service";

@Component({
    selector: 'app-register-step0',
    templateUrl: './register-step0.component.html',
    styleUrls: ['./register-step0.component.scss']
})
export class RegisterStep0Component implements OnInit {

    @Output() onStepSucceed = new EventEmitter;
    @Output() onUserCreated = new EventEmitter;

    form: FormGroup;
    formErrors: any;

    title: string;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private registerService: RegisterService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private appSetting: AppSettingService,
        private scMessageService: SCMessageService
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

        this.title = this.appSetting.baseData.registration_msg_welcome;
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

    save() {
        if (this.form.invalid) return;
        this.spinner.show();
        const params = this.form.value;
        this.authService.register(params).subscribe(res => {
            this.spinner.hide();
            //this.toastr.success("Saved");
            this.onUserCreated.next(res.user);
            this.onStepSucceed.next(res.steps);
        }, err => {
            this.spinner.hide();
            this.scMessageService.error(err);
        });
    }

    quit() {
        this.router.navigate(['/login']);
    }

}
