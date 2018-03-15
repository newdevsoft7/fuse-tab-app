import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SettingsService } from './settings.service';
import { SharedModule } from '../../../core/modules/shared.module';
import { SettingsComponent } from './settings.component';
import { SettingsSidenavComponent } from './sidenav/sidenav.component';
import { SettingsWorkAreasComponent } from './work-areas/work-areas.component';
import { SettingsWorkAreasMainComponent } from './work-areas/main/main.component';
import { SettingsWorkAreasCategoriesComponent } from './work-areas/categories/categories.component';
import { SettingsWorkAreasAddCategoryComponent } from './work-areas/add-category/add-category.component';
import { SettingsWorkAreasEditCatNameComponent } from './work-areas/edit-category-name/edit-category-name.component';
import { SettingsWorkAreasAddComponent } from './work-areas/add-workarea/add-workarea.component';
import { SettingsWorkAreasEditNameComponent } from './work-areas/edit-workarea-name/edit-workarea-name.component';
import { SettingsWorkAreasEditCategoryComponent } from './work-areas/edit-workarea-category/edit-workarea-category.component';
import { SettingsWorkAreasEditTimezoneComponent } from './work-areas/edit-workarea-timezone/edit-workarea-timezone.component';
import { WorkAreaFormDialogComponent } from './work-areas/dialogs/workarea-form/workarea-form.component';
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
        SettingsWorkAreasMainComponent,
        SettingsWorkAreasAddComponent,
        SettingsWorkAreasEditNameComponent,
        SettingsWorkAreasEditCategoryComponent,
        SettingsWorkAreasEditTimezoneComponent,
        WorkAreaFormDialogComponent,
        SettingsWorkAreasCategoriesComponent,
        SettingsWorkAreasAddCategoryComponent,
        SettingsWorkAreasEditCatNameComponent,
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
        SettingsShiftFlagsComponent
    ],

    providers: [SettingsService],
    entryComponents: [WorkAreaFormDialogComponent],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }