import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileExperienceService } from './experience.service';
import { SharedModule } from '../../../../core/modules/shared.module';
import { ProfileExperienceComponent } from './experience.component';
import { ProfileExperienceAddCategoryComponent } from './add-category/add-category.component';
import { ExperienceHeadingDialogComponent } from './heading-dialog/heading-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        ProfileExperienceComponent,
        ProfileExperienceAddCategoryComponent,
        ExperienceHeadingDialogComponent
    ],
    exports: [
        ProfileExperienceComponent
    ],
    providers: [
        ProfileExperienceService
    ],
    entryComponents: [
        ExperienceHeadingDialogComponent
    ]
})
export class ProfileExperienceModule { }
