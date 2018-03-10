import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { ProfileInfoModule } from '../profile/info/profile-info.module';
import { ScheduleModule } from '../schedule/schedule.module';

import { FuseHomeComponent } from './home.component';
import { SettingsModule } from '../settings/settings.module';
import { ProfileRatingsModule } from '../profile/ratings/profile-ratings.module';
import { ProfileAttributesModule } from '../profile/attributes/profile-attributes.module';
import { TrackingModule } from '../tracking/tracking.module';
import { AccountingModule } from '../accounting/accounting.module';

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
        AccountingModule
    ],
    exports     : [
        FuseHomeComponent
    ]
})

export class FuseHomeModule
{
}
