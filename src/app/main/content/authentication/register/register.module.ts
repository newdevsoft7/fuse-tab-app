import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseRegisterComponent } from './register.component';
import { UnauthGuardService } from '../../../../shared/guards/unauth-guard.service';

const routes = [
    {
        path     : 'register',
        component: FuseRegisterComponent,
        canActivate: [ UnauthGuardService ]
    }
];

@NgModule({
    declarations: [
        FuseRegisterComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class RegisterModule
{

}
