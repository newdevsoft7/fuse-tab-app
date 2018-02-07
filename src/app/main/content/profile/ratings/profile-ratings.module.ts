import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { ProfileRatingsService } from './profile-ratings.service';
import { ProfileRatingsComponent } from './profile-ratings.component';
import { ProfileRatingsAddFieldComponent } from './add-field/add-field.component';
import { ProfileRatingsEditElementNameComponent } from './edit-element-name/edit-element-name.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        
    ],

    declarations: [
        ProfileRatingsComponent,
        ProfileRatingsAddFieldComponent,
        ProfileRatingsEditElementNameComponent
    ],

    providers: [ProfileRatingsService],
    entryComponents: [],
    exports: [
        ProfileRatingsComponent
    ]
})
export class ProfileRatingsModule { }