import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../core/services/config.service';
import { fuseAnimations } from '../../../../core/animations';
import { AppSettingService } from '../../../../shared/services/app-setting.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
    selector   : 'fuse-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls  : ['./reset-password.component.scss'],
    animations : fuseAnimations
})
export class FuseResetPasswordComponent implements OnInit
{
    resetPasswordForm: FormGroup;
    resetPasswordFormErrors: any;
    logoUrl: string;
    backgroundImg: string;

    email: string;
    token: string;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private appSettingService: AppSettingService,
        private authService: AuthenticationService,
        private spinner: CustomLoadingService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.resetPasswordFormErrors = {
            password       : {},
            passwordConfirm: {}
        };
    }

    ngOnInit()
    {
        this.logoUrl = this.appSettingService.baseData.logo;
        this.backgroundImg = this.appSettingService.baseData.background;

        this.resetPasswordForm = this.formBuilder.group({
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPassword]]
        });

        this.resetPasswordForm.valueChanges.subscribe(() => {
            this.onResetPasswordFormValuesChanged();
        });

        this.route.queryParams.subscribe(params => {
            if (!params.email || !params.token) {
                this.toastrService.error('Insufficient params!');
            }
            this.email = params.email;
            this.token = params.token;
        });
    }

    async confirmEmail() {
        try {
            this.spinner.show();
            await this.authService.resetPassword({
                email: this.email,
                token: this.token,
                client_id: environment.clientId,
                new_password: this.resetPasswordForm.get('password').value
            });
            this.toastrService.success('Password has been reset successfully!');
            this.router.navigate(['/login']);
        } catch (e) {
            this.toastrService.error(e.error.message);
        } finally {
            this.spinner.hide();
        }
    }

    onResetPasswordFormValuesChanged()
    {
        for ( const field in this.resetPasswordFormErrors )
        {
            if ( !this.resetPasswordFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.resetPasswordFormErrors[field] = {};

            // Get the control
            const control = this.resetPasswordForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.resetPasswordFormErrors[field] = control.errors;
            }
        }
    }
}

function confirmPassword(control: AbstractControl)
{
    if ( !control.parent || !control )
    {
        return;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return;
    }

    if ( passwordConfirm.value === '' )
    {
        return;
    }

    if ( password.value !== passwordConfirm.value )
    {
        return {
            passwordsNotMatch: true
        };
    }
}
