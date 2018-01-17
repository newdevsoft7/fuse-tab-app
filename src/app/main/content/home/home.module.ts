import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { ProfileInfoModule } from '../profile/info/profile-info.module';

import { FuseHomeComponent } from './home.component';

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
    ],
    exports     : [
        FuseHomeComponent
    ]
})

export class FuseHomeModule
{
}
