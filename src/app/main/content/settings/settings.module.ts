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
        SettingsWorkAreasEditCatNameComponent
    ],

    providers: [SettingsService],
    entryComponents: [WorkAreaFormDialogComponent],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }