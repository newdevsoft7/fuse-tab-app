import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from '../../../core/modules/shared.module';
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
import { UsersChatComponent } from './chat/chat.component';
import { UsersChatService } from './chat/chat.service';
import { FuseChatViewComponent } from './chat/chat-view/chat-view.component';
import { FuseChatLeftSidenavComponent } from './chat/sidenavs/left/left.component';
import { FuseChatChatsSidenavComponent } from './chat/sidenavs/left/chats/chats.component';
import { BtnAddContactComponent } from './chat/sidenavs/left/btn-add-contact/btn-add-contact.component';
import { NewThreadFormDialogComponent, AddUserFormDialogComponent } from './chat/dialogs';
import { UsersProfileAttributesComponent } from './profile/attributes/attributes.component';
import { UsersProfileWorkAreasComponent } from './profile/workareas/workareas.component';
import { UsersSearchBarComponent } from './search-bar/search-bar.component';
import { UsersAddFilterDialogComponent } from './search-bar/add-filter/add-filter.component';
import { UsersExportDialogComponent } from './users-export-dialog/users-export-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        UsersComponent,
        UsersSearchBarComponent,
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
        UsersChatComponent,
        FuseChatViewComponent,
        FuseChatLeftSidenavComponent,
        FuseChatChatsSidenavComponent,
        BtnAddContactComponent,
        NewThreadFormDialogComponent,
        AddUserFormDialogComponent,
        UsersProfileAttributesComponent,
        UsersProfileWorkAreasComponent,
        UsersAddFilterDialogComponent,
        UsersExportDialogComponent
    ],
    exports: [
        UsersComponent,
        UsersProfileComponent,
        UsersChatComponent,
        FuseChatViewComponent,
        FuseChatLeftSidenavComponent,
        FuseChatChatsSidenavComponent,
        BtnAddContactComponent,
        NewThreadFormDialogComponent,
        AddUserFormDialogComponent
    ],
    providers: [
        UserService,
        UsersChatService
    ],
    entryComponents: [
        UserFormDialogComponent,
        UsersProfilePhotoGalleryDialogComponent,
        UsersProfileVideoGalleryDialogComponent,
        UsersAddFilterDialogComponent,
        NewThreadFormDialogComponent,
        AddUserFormDialogComponent,
        UsersExportDialogComponent
    ]
})
export class UsersModule { }
