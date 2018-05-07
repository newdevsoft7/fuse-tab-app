import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { ProfileInfoModule } from '../profile/info/profile-info.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { FormSignModule } from '../form-sign/form-sign.module';
import { QuizModule } from '../quiz/quiz.module';

import { FuseHomeComponent } from './home.component';
import { SettingsModule } from '../settings/settings.module';
import { ProfileRatingsModule } from '../profile/ratings/profile-ratings.module';
import { ProfileAttributesModule } from '../profile/attributes/profile-attributes.module';
import { TrackingModule } from '../tracking/tracking.module';
import { AccountingModule } from '../accounting/accounting.module';
import { TimelineComponent } from './timeline/timeline.component';
import { HomeService } from './home.service';
import { UserService } from '../users/user.service';
import { EditPostDialogComponent } from './timeline/edit-post-dialog/edit-post-dialog.component';
import { EditCommentDialogComponent } from './timeline/edit-comment-dialog/edit-comment-dialog.component';
import { PinPostDialogComponent } from './timeline/pin-post-dialog/pin-post-dialog.component';
import { PostDialogComponent } from './timeline/post-dialog/post-dialog.component';
import { PayrollModule } from '../payroll/payroll.module';
import { TemplatesModule } from '../templates/templates.module';
import { ClientsModule } from '../clients/clients.module';
import { TimelineModule } from './timeline/timeline.module';

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
        AccountingModule,
        FormSignModule,
        QuizModule,
        PayrollModule,
        TemplatesModule,
        ClientsModule,
        TimelineModule
    ],
    exports     : [
        FuseHomeComponent
    ],
    providers   : [
        HomeService,
        UserService
    ],
    entryComponents: [
    ]
})

export class FuseHomeModule
{
}
