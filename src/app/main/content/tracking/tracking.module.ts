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
        TrackingEditCategoryNameComponent
    ],

    providers: [TrackingService],
    entryComponents: [],
    exports: [
        TrackingComponent
    ]
})
export class TrackingModule { }