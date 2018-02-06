import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimezonePickerModule } from 'ng2-timezone-selector';


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


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        TimezonePickerModule
    ],

    declarations: [
        SettingsComponent,
        SettingsSidenavComponent,
        SettingsWorkAreasComponent,
        SettingsWorkAreasMainComponent,
        SettingsWorkAreasAddComponent,
        SettingsWorkAreasCategoriesComponent,
        SettingsWorkAreasAddCategoryComponent,
        SettingsWorkAreasEditCatNameComponent
    ],

    providers: [SettingsService],
    entryComponents: [],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }