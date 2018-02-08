import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { ProfileInfoModule } from '../profile/info/profile-info.module';
import { ScheduleModule } from '../schedule/schedule.module';

import { FuseHomeComponent } from './home.component';
import { AuthenticationModule } from '../../../shared/authentication/authentication.module';
import { SettingsModule } from '../settings/settings.module';
import { ProfileRatingsModule } from '../profile/ratings/profile-ratings.module';
import { ProfileAttributesModule } from '../profile/attributes/profile-attributes.module';
import { TrackingModule } from '../tracking/tracking.module';

// const routes = [
//     {
//         path: '',
//         component: FuseHomeComponent
//     }
// ];

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
        ProfileAttributesModule,
        ProfileRatingsModule,
        ScheduleModule,
        SettingsModule,
        TrackingModule,
        AuthenticationModule,

        // RouterModule.forChild(routes)
    ],
    exports     : [
        FuseHomeComponent
    ]
})

export class FuseHomeModule
{
}
