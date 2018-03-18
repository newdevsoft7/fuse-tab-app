import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SettingsService } from './settings.service';
import { SharedModule } from '../../../core/modules/shared.module';
import { SettingsComponent } from './settings.component';
import { SettingsSidenavComponent } from './sidenav/sidenav.component';
import { SettingsWorkAreasComponent } from './work-areas/work-areas.component';
import { SettingsWorkAreaItemComponent } from './work-areas/work-area-item/work-area-item.component';
import { SettingsWorkGroupItemComponent } from './work-areas/work-group-item/work-group-item.component';
import { SettingsCheckInOutComponent } from './check-in-out/check-in-out.component';
import { SettingsClientComponent } from './client/client.component';
import { SettingsClientInvoicesComponent } from './client-invoices/client-invoices.component';
import { SettingsEmailComponent } from './email/email.component';
import { SettingsExpensesComponent } from './expenses/expenses.component';
import { SettingsFormsComponent } from './forms/forms.component';
import { SettingsLocationsComponent } from './locations/locations.component';
import { SettingsOutsourcingComponent } from './outsourcing/outsourcing.component';
import { SettingsPayLevelsComponent } from './pay-levels/pay-levels.component';
import { SettingsProfileDocumentsComponent } from './profile-documents/profile-documents.component';
import { SettingsProfilePhotosComponent } from './profile-photos/profile-photos.component';
import { SettingsProfileVideosComponent } from './profile-videos/profile-videos.component';
import { SettingsQuizsComponent } from './quizs/quizs.component';
import { SettingsRegistrationComponent } from './registration/registration.component';
import { SettingsSchedulingComponent } from './scheduling/scheduling.component';
import { SettingsShowcasesComponent } from './showcases/showcases.component';
import { SettingsStaffComponent } from './staff/staff.component';
import { SettingsStaffInvoicesComponent } from './staff-invoices/staff-invoices.component';
import { SettingsSurveysComponent } from './surveys/surveys.component';
import { SettingsSystemComponent } from './system/system.component';
import { SettingsTrackingComponent } from './tracking/tracking.component';
import { SettingsUserTableComponent } from './user-table/user-table.component';
import { SettingsWorkMarketComponent } from './work-market/work-market.component';
import { SettingsXeroComponent } from './xero/xero.component';
import { SettingsShiftFlagsComponent } from './shift-flags/shift-flags.component';
import { SettingsPayLevelItemComponent } from './pay-levels/pay-level-item/pay-level-item.component';
import { SettingsPayCategoryItemComponent } from './pay-levels/pay-category-item/pay-category-item.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
    ],

    declarations: [
        SettingsComponent,
        SettingsSidenavComponent,
        SettingsWorkAreasComponent,
        SettingsWorkAreaItemComponent,
        SettingsWorkGroupItemComponent,
        SettingsCheckInOutComponent,
        SettingsClientComponent,
        SettingsClientInvoicesComponent,
        SettingsEmailComponent,
        SettingsExpensesComponent,
        SettingsFormsComponent,
        SettingsLocationsComponent,
        SettingsOutsourcingComponent,
        SettingsPayLevelsComponent,
        SettingsProfileDocumentsComponent,
        SettingsProfilePhotosComponent,
        SettingsProfileVideosComponent,
        SettingsQuizsComponent,
        SettingsRegistrationComponent,
        SettingsSchedulingComponent,
        SettingsShowcasesComponent,
        SettingsStaffComponent,
        SettingsStaffInvoicesComponent,
        SettingsSurveysComponent,
        SettingsSystemComponent,
        SettingsTrackingComponent,
        SettingsUserTableComponent,
        SettingsWorkMarketComponent,
        SettingsXeroComponent,
        SettingsShiftFlagsComponent,
        SettingsPayLevelItemComponent,
        SettingsPayCategoryItemComponent
    ],

    providers: [
        SettingsService
    ],
    entryComponents: [
        
    ],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }