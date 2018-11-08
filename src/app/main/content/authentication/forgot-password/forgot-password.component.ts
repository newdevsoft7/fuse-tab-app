import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../core/services/config.service';
import { fuseAnimations } from '../../../../core/animations';
import { AppSettingService } from '../../../../shared/services/app-setting.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector   : 'fuse-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls  : ['./forgot-password.component.scss'],
    animations : fuseAnimations
})
export class FuseForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    forgotPasswordFormErrors: any;
    logoUrl: string;
    backgroundImg: string;
    isRequestSent = false;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private appSettingService: AppSettingService,
        private authService: AuthenticationService,
        private spinner: CustomLoadingService,
        private toastr: ToastrService
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.forgotPasswordFormErrors = {
            email: {}
        };
    }

    ngOnInit()
    {
        this.logoUrl = this.appSettingService.baseData.logo;
        this.backgroundImg = this.appSettingService.baseData.background;

        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.forgotPasswordForm.valueChanges.subscribe(() => {
            this.onForgotPasswordFormValuesChanged();
        });
    }

    onForgotPasswordFormValuesChanged()
    {
        for ( const field in this.forgotPasswordFormErrors )
        {
            if ( !this.forgotPasswordFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.forgotPasswordFormErrors[field] = {};

            // Get the control
            const control = this.forgotPasswordForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.forgotPasswordFormErrors[field] = control.errors;
            }
        }
    }

    async sendLink() {
        const payload = this.forgotPasswordForm.getRawValue();
        try {
            this.spinner.show();
            await this.authService.sendForgotPasswordLink(payload);
            this.isRequestSent = true;
            this.toastr.success('We have emailed you a link to reset your password.');
        } catch (e) {
            this.toastr.error(e.error.message);
        } finally {
            this.spinner.hide();
        }
    }
}
