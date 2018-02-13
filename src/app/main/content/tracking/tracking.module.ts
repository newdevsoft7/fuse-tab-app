import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { TrackingService } from './tracking.service';
import { TrackingComponent } from './tracking.component';
import { TrackingSidenavComponent } from './sidenav/sidenav.component';
import { TrackingOptionComponent } from './option/option.component';
import { TrackingAddCategoryComponent } from './add-category/add-category.component';
import { TrackingEditCategoryNameComponent } from './edit-category-name/edit-category-name.component';
import { TrackingEditCategoryStaffComponent } from './edit-category-staff/edit-category-staff.component';
import { TrackingEditCategoryClientComponent } from './edit-category-client/edit-category-client.component';
import { TrackingAddOptionComponent } from './add-option/add-option.component';
import { TrackingEditOptionNameComponent } from './edit-option-name/edit-option-name.component';
import { TrackingEditOptionStaffComponent } from './edit-option-staff/edit-option-staff.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],

    declarations: [
        TrackingComponent,
        TrackingSidenavComponent,
        TrackingOptionComponent,
        TrackingAddCategoryComponent,
        TrackingEditCategoryNameComponent,
        TrackingEditCategoryStaffComponent,
        TrackingEditCategoryClientComponent,
        TrackingAddOptionComponent,
        TrackingEditOptionNameComponent,
        TrackingEditOptionStaffComponent
    ],

    providers: [TrackingService],
    entryComponents: [],
    exports: [
        TrackingComponent
    ]
})
export class TrackingModule { }