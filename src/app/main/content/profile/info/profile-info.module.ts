import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../core/modules/shared.module';

import { ProfileInfoService } from './profile-info.service';

import { ProfileInfoComponent } from './profile-info.component';
import { ProfileInfoCategoryDialogComponent } from './dialogs/category/category.component';
import { ProfileInfoElementDialogComponent } from './dialogs/element/element.component';
import { ProfileInfoEditCategoryNameComponent } from './edit-category-name/edit-category-name.component';
import { ProfileInfoEditElementNameComponent } from './edit-element-name/edit-element-name.component';
import { ProfileInfoAddCategoryComponent } from './add-category/add-category.component';
import { ProfileInfoAddFieldComponent } from './add-field/add-field.component';
import { ProfileInfoEditElementVisibilityComponent } from './edit-element-visibility/edit-element-visibility.component';
import { ProfileInfoEditElementSexComponent } from './edit-element-sex/edit-element-sex.component';
import { ProfileInfoEditElementTypeComponent } from './edit-element-type/edit-element-type.component';
import { ProfileInfoEditElementOptionsDialogComponent } from './dialogs/edit-element-options/edit-element-options.component';

@NgModule({
	imports: [
        CommonModule,
        SharedModule

	],
	declarations: [
		ProfileInfoComponent,
		ProfileInfoCategoryDialogComponent,
		ProfileInfoElementDialogComponent,
        ProfileInfoEditCategoryNameComponent,
        ProfileInfoEditElementNameComponent,
        ProfileInfoAddCategoryComponent,
        ProfileInfoAddFieldComponent,
        ProfileInfoEditElementVisibilityComponent,
        ProfileInfoEditElementSexComponent,
        ProfileInfoEditElementTypeComponent,
        ProfileInfoEditElementOptionsDialogComponent
    ],
    exports: [
        ProfileInfoComponent
    ],
    providers: [
        ProfileInfoService
    ],
    entryComponents: [
        ProfileInfoCategoryDialogComponent,
        ProfileInfoElementDialogComponent,
        ProfileInfoEditElementOptionsDialogComponent
    ]
})
export class ProfileInfoModule { }
