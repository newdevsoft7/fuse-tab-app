import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseForgotPasswordComponent } from './forgot-password.component';
import { UnauthGuardService } from '../../../../shared/guards/unauth-guard.service';

const routes = [
    {
        path     : 'forgot-password',
        component: FuseForgotPasswordComponent,
        canActivate: [ UnauthGuardService ]
    }
];

@NgModule({
    declarations: [
        FuseForgotPasswordComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class ForgotPasswordModule
{

}
