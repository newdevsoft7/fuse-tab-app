import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { ProfileInfoModule } from '../profile/info/profile-info.module';

import { FuseHomeComponent } from './home.component';
import { AuthenticationModule } from '../../../shared/authentication/authentication.module';

const routes = [
    {
        path: '',
        component: FuseHomeComponent
    }
];

@NgModule({
    declarations: [
        FuseHomeComponent
    ],
    imports     : [
        SharedModule,
        TabModule,
        UsersModule,
        ProfileModule,
        ProfileInfoModule,
        AuthenticationModule,
        RouterModule.forChild(routes)
    ],
    exports     : [
        FuseHomeComponent
    ]
})

export class FuseHomeModule
{
}
