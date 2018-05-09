import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseResetPasswordComponent } from './reset-password.component';
import { UnauthGuardService } from '../../../../shared/guards/unauth-guard.service';

const routes = [
    {
        path     : 'reset-password',
        component: FuseResetPasswordComponent,
        canActivate: [ UnauthGuardService ]
    }
];

@NgModule({
    declarations: [
        FuseResetPasswordComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class ResetPasswordModule
{

}
