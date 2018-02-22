import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseLoginComponent } from './login.component';
import { UnauthGuardService } from '../../../../shared/guards/unauth-guard.service';

const routes = [
    {
        path     : 'login',
        component: FuseLoginComponent,
        canActivate: [ UnauthGuardService ]
    }
];

@NgModule({
    declarations: [
        FuseLoginComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class LoginModule
{

}
