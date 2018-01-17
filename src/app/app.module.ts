import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { FuseHomeModule } from './main/content/home/home.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoginModule } from './main/content/authentication/login/login.module';
import { AuthenticationModule } from './shared/authentication/authentication.module';
import { FuseHomeComponent } from './main/content/home/home.component';
import { ProtectedGuard } from 'ngx-auth';


const appRoutes: Routes = [
    {
        path: 'home',
        component: FuseHomeComponent,
        canActivate: [ ProtectedGuard ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        FuseMainModule,
        FuseHomeModule,
        LoginModule,
        AuthenticationModule
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
