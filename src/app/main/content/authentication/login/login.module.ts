import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseLoginComponent } from './login.component';
import { PublicGuard } from 'ngx-auth'

const routes = [
    {
        path     : 'login',
        component: FuseLoginComponent,
        canActivate: [ PublicGuard ]
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
