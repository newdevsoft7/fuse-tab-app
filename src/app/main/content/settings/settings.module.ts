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
import { SettingsScheduleListComponent } from './schedule-list/schedule-list.component';
import { SettingsWorkMarketComponent } from './work-market/work-market.component';
import { SettingsXeroComponent } from './xero/xero.component';
import { SettingsShiftFlagsComponent } from './shift-flags/shift-flags.component';
import { SettingsPayLevelItemComponent } from './pay-levels/pay-level-item/pay-level-item.component';
import { SettingsPayCategoryItemComponent } from './pay-levels/pay-category-item/pay-category-item.component';
import { ItemComponent } from './shift-flags/item/item.component';
import { CKEditor5Module } from '../../../core/components/ckeditor/ckeditor.module';
import { SettingsUserStatusesComponent } from './user-statuses/user-statuses.component';
import { UserStatusItemComponent } from './user-statuses/item/item.component';
import { CategoryDialogComponent } from './tracking/category-dialog/category-dialog.component';
import { SettingsChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        CKEditor5Module
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
        SettingsPayCategoryItemComponent,
        SettingsScheduleListComponent,
        ItemComponent,
        SettingsUserStatusesComponent,
        UserStatusItemComponent,
        CategoryDialogComponent,
        SettingsChangePasswordComponent
    ],

    providers: [
        SettingsService
    ],
    entryComponents: [
        CategoryDialogComponent
    ],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }
