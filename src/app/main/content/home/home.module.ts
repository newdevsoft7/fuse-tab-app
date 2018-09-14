import { NgModule } from '@angular/core';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { FormSignModule } from '../form-sign/form-sign.module';
import { QuizModule } from '../quiz/quiz.module';

import { FuseHomeComponent } from './home.component';
import { SettingsModule } from '../settings/settings.module';
import { TrackingModule } from '../tracking/tracking.module';
import { AccountingModule } from '../accounting/accounting.module';
import { HomeService } from './home.service';
import { UserService } from '../users/user.service';
import { PayrollModule } from '../payroll/payroll.module';
import { TemplatesModule } from '../templates/templates.module';
import { ClientsModule } from '../clients/clients.module';
import { TimelineModule } from './timeline/timeline.module';
import { OutsourceCompaniesModule } from '../outsource-companies/outsource-companies.module';
import { ClientInvoicesModule } from '../client-invoices/client-invoices.module';
import { ReportsUploadsModule } from '../reports-uploads/reports-uploads.module';
import { SetUserTimezoneDialogComponent } from './set-user-timezone-dialog/set-user-timezone-dialog.component';
import { ShowcaseModule } from '../showcase/showcase.module';

@NgModule({
    declarations: [
        FuseHomeComponent,
        SetUserTimezoneDialogComponent
    ],
    imports     : [
        SharedModule,
        TabModule,
        UsersModule,
        ScheduleModule,
        SettingsModule,
        TrackingModule,
        AccountingModule,
        FormSignModule,
        QuizModule,
        PayrollModule,
        TemplatesModule,
        ClientsModule,
        ClientInvoicesModule,
        OutsourceCompaniesModule,
        TimelineModule,
        ReportsUploadsModule,
        ShowcaseModule
    ],
    exports     : [
        FuseHomeComponent
    ],
    providers   : [
        HomeService,
        UserService
    ],
    entryComponents: [
        SetUserTimezoneDialogComponent
    ]
})

export class FuseHomeModule
{
}
