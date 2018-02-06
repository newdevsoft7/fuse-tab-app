import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SettingsService } from './settings.service';
import { SharedModule } from '../../../core/modules/shared.module';
import { SettingsComponent } from './settings.component';
import { SettingsSidenavComponent } from './sidenav/sidenav.component';
import { SettingsWorkAreasComponent } from './work-areas/work-areas.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],

    declarations: [
        SettingsComponent,
        SettingsSidenavComponent,
        SettingsWorkAreasComponent

    ],

    providers: [SettingsService],
    entryComponents: [],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule { }