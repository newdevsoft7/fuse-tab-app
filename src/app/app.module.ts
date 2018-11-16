import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { FuseHomeModule } from './main/content/home/home.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoginModule } from './main/content/authentication/login/login.module';
import { FuseHomeComponent } from './main/content/home/home.component';
import { CustomToastComponent } from './shared/services/custom-toast.component';
import { AuthGuardService } from './shared/guards/auth-guard.service';
import { SCHttpInterceptor } from './shared/interceptor/http-interceptor';
import { AppSettingService } from './shared/services/app-setting.service';
import { CustomLoadingService } from './shared/services/custom-loading.service';
import { ResetPasswordModule } from './main/content/authentication/reset-password/reset-password.module';
import { ForgotPasswordModule } from './main/content/authentication/forgot-password/forgot-password.module';
import { RegistrationGuardService } from './shared/guards/registration-guard.service';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { NotExistComponent } from './main/content/not-exist/not-exist.component';
import { NotExistGuardService } from './shared/guards/not-exist-guard.service';

export function init(config: AppSettingService) {
    return () => config.load();
}

const appRoutes: Routes = [
    {
        path: 'register',
        loadChildren: './main/content/authentication/register/register.module#RegisterModule',
        canActivate: [RegistrationGuardService]
    },
    {
        path: 'home',
        component: FuseHomeComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'not-exist',
        component: NotExistComponent,
        canActivate: [NotExistGuardService]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        CustomToastComponent,
        NotExistComponent
    ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            toastComponent: CustomToastComponent,
            timeOut: 5000
        }),
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        FuseMainModule,
        FuseHomeModule,
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        LoadingModule.forRoot({
            fullScreenBackdrop: true
        }),
        NgxStripeModule.forRoot(environment.stripeApiKey)
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        AppSettingService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SCHttpInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: init,
            deps: [AppSettingService],
            multi: true
        },
        CustomLoadingService
    ],
    entryComponents: [
        CustomToastComponent
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
