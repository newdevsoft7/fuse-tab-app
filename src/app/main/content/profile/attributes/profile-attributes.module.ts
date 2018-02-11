import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../core/modules/shared.module';
import { ProfileAttributesComponent } from './profile-attributes.component';
import { ProfileAttributesAddCategoryComponent } from './add-category/add-category.component';
import { ProfileAttributesAddAttributeComponent } from './add-attribute/add-attribute.component';
import { ProfileAttributesEditCategoryNameComponent } from './edit-category-name/edit-category-name.component';
import { ProfileAttributesEditAttributeRoleComponent } from './edit-attribute-role/edit-attribute-role.component';
import { ProfileAttributesAttributeDialogComponent } from './dialogs/attribute/attribute.component';
import { ProfileAttributesCategoryDialogComponent } from './dialogs/category/category.component';
import { ProfileAttributesService } from './profile-attributes.service';
import { ProfileAttributesEditAttributeNameComponent } from './edit-attribute-name/edit-attribute-name.component';
import { ProfileAttributesEditAttributeVSComponent } from './edit-attribute-visibility/edit-attribute-visibility.component';



@NgModule({
	imports: [
        CommonModule,
        SharedModule
	],
	declarations: [
        ProfileAttributesComponent,
        ProfileAttributesAttributeDialogComponent,
        ProfileAttributesCategoryDialogComponent,
        ProfileAttributesAddCategoryComponent,
        ProfileAttributesAddAttributeComponent,
        ProfileAttributesEditCategoryNameComponent,
        ProfileAttributesEditAttributeNameComponent,
        ProfileAttributesEditAttributeRoleComponent,
        ProfileAttributesEditAttributeVSComponent,
    ],
    exports: [
        ProfileAttributesComponent
    ],
    providers: [
        ProfileAttributesService
    ],
    entryComponents: [
        ProfileAttributesAttributeDialogComponent,
        ProfileAttributesCategoryDialogComponent
    ]
})
export class ProfileAttributesModule { }
