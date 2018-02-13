import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersExportsComponent } from './exports/exports.component';
import { UsersPresentationsComponent } from './presentations/presentations.component';
import { SharedModule } from '../../../core/modules/shared.module';
import { AuthenticationModule } from '../../../shared/authentication/authentication.module';
import { UserService } from './user.service';
import { UserFormDialogComponent } from './dialogs/user-form/user-form.component';
import { UsersProfileComponent } from './profile/profile.component';
import { UsersProfileAboutComponent } from './profile/about/about.component';
import { UsersProfilePhotoComponent } from './profile/photo/photo.component';
import { UsersProfileEditTextValueComponent } from './profile/about/edit-text-value/edit-text-value.component';
import { UsersProfileEditListValueComponent } from './profile/about/edit-list-value/edit-list-value.component';
import { UsersProfileEditBasicTextValueComponent } from './profile/about/edit-basic-text-value/edit-basic-text-value.component';
import { UsersProfileEditSexComponent } from './profile/about/edit-sex/edit-sex.component';
import { UsersProfileEditListmValueComponent } from './profile/about/edit-listm-value/edit-listm-value.component';
import { UsersProfileEditDateComponent } from './profile/about/edit-date/edit-date.component';
import { UsersProfilePhotoGalleryDialogComponent } from './profile/photo/photo-gallery-dialog/photo-gallery-dialog.component';
import { UsersProfileVideoComponent } from './profile/video/video.component';
import { UsersProfileVideoGalleryDialogComponent } from './profile/video/video-gallery-dialog/video-gallery-dialog.component';
import { UsersProfileDocumentComponent } from './profile/document/document.component';
import { UsersProfileAttributesComponent } from './profile/attributes/attributes.component';
import { UsersProfileWorkAreasComponent } from './profile/workareas/workareas.component';
import { UsersSearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AuthenticationModule
    ],
    declarations: [
        UsersComponent,
        UsersSearchBarComponent,
        UsersExportsComponent,
        UsersPresentationsComponent,
        UserFormDialogComponent,
        UsersProfileComponent,
        UsersProfileAboutComponent,
        UsersProfilePhotoComponent,
        UsersProfileEditTextValueComponent,
        UsersProfileEditListValueComponent,
        UsersProfileEditListmValueComponent,
        UsersProfileEditBasicTextValueComponent,
        UsersProfileEditSexComponent,
        UsersProfileEditDateComponent,
        UsersProfilePhotoGalleryDialogComponent,
        UsersProfileVideoComponent,
        UsersProfileVideoGalleryDialogComponent,
        UsersProfileDocumentComponent,
        UsersProfileAttributesComponent,
        UsersProfileWorkAreasComponent
    ],
    exports: [
        UsersComponent,
        UsersExportsComponent,
        UsersPresentationsComponent,
        UsersProfileComponent
    ],
    providers: [
        UserService
    ],
    entryComponents: [
        UserFormDialogComponent,
        UsersProfilePhotoGalleryDialogComponent,
        UsersProfileVideoGalleryDialogComponent
    ]
})
export class UsersModule { }
