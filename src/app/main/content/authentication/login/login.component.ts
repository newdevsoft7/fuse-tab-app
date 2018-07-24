import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../core/services/config.service';
import { fuseAnimations } from '../../../../core/animations';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { SocketService } from '../../../../shared/services/socket.service';
import { AppSettingService } from '../../../../shared/services/app-setting.service';
import { ConnectorService } from '../../../../shared/services/connector.service';

@Component({
    selector   : 'fuse-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})


export class FuseLoginComponent implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;
    isSuccess = true;
    message = '';
    isSubmitted = false;

    socketService: SocketService;
    logoUrl: string;
    backgroundImg: string;

    isRegisterEnabled: boolean;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private injector: Injector,
        private appSettingService: AppSettingService,
        private connectorService: ConnectorService
    )
    {
        this.socketService = this.injector.get(SocketService);

        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            username: {},
            password: {}
        };
    }

    ngOnInit()
    {
        this.isRegisterEnabled = this.appSettingService.baseData.registration_enable == 1? true : false;
        this.logoUrl = this.appSettingService.baseData.logo;
        this.backgroundImg = this.appSettingService.baseData.background;

        this.loginForm = this.formBuilder.group({
            username   : ['', [Validators.required, Validators.email]], 
            password   : ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
            this.isSuccess = true;
        });

        this.socketService.disableReconnect();
        this.socketService.closeConnection();
    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    async login() {
        this.isSubmitted = true;
        const username = this.loginForm.getRawValue().username;
        const password = this.loginForm.getRawValue().password;

        try {
            await this.authService.login(username, password).toPromise();

            try {
                const formconnect = await this.connectorService.fetchConnectorData('formconnect');
                this.authService.saveConnectData({ formconnect });
            } catch (e) {}

            try {
                const quizconnect = await this.connectorService.fetchConnectorData('quizconnect');
                this.authService.saveConnectData({ quizconnect });
            } catch (e) {}

            try {
                const showcaseconnect = await this.connectorService.fetchConnectorData('showcaseconnect');
                this.authService.saveConnectData({ showcaseconnect });
            } catch (e) {}

            this.router.navigate(['/home'], { queryParamsHandling: 'merge' });
        } catch (err) {
            this.isSuccess = false;
            this.isSubmitted = false;
            this.message = err.error.message;
        }
    }
}
