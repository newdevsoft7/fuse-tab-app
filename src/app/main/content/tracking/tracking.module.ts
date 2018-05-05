import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { TrackingService } from './tracking.service';
import { TrackingComponent } from './tracking.component';
import { TrackingAddOptionComponent } from './add-option/add-option.component';
import { TrackingOptionAccessComponent } from './option-access/option-access.component';
import { TrackingOptionFilesComponent } from './option-files/option-files.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],

    declarations: [
        TrackingComponent,
        TrackingAddOptionComponent,
        TrackingOptionAccessComponent,
        TrackingOptionFilesComponent
    ],

    providers: [TrackingService],
    entryComponents: [],
    exports: [
        TrackingComponent
    ]
})
export class TrackingModule { }
