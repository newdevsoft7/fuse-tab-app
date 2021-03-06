import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from '../../../core/modules/shared.module';
import { ClipboardModule } from 'ngx-clipboard';
import { UserService } from './user.service';
import { UserFormDialogComponent } from './dialogs/user-form/user-form.component';
import { AssignReportDialogComponent } from './dialogs/assign-report/assign-report.component';
import { UsersProfileComponent } from './profile/profile.component';
import { UsersProfileAboutComponent } from './profile/about/about.component';
import { UsersProfilePhotoComponent } from './profile/photo/photo.component';
import { UsersProfileEditTextValueComponent } from './profile/about/edit-text-value/edit-text-value.component';
import { UsersProfileEditListValueComponent } from './profile/about/edit-list-value/edit-list-value.component';
import { UsersProfileEditBasicTextValueComponent } from './profile/about/edit-basic-text-value/edit-basic-text-value.component';
import { UsersProfileEditSexComponent } from './profile/about/edit-sex/edit-sex.component';
import { UsersProfileEditListmValueComponent } from './profile/about/edit-listm-value/edit-listm-value.component';
import { UsersProfileEditDateComponent } from './profile/about/edit-date/edit-date.component';
import { UsersProfileEditCountryComponent } from './profile/about/edit-country/edit-country.component';
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
import { NewThreadFormDialogComponent, AddUserFormDialogComponent, RenameThreadFormDialogComponent } from './chat/dialogs';
import { UsersProfileAttributesComponent } from './profile/attributes/attributes.component';
import { UsersProfileWorkAreasComponent } from './profile/workareas/workareas.component';
import { UsersSearchBarComponent } from './search-bar/search-bar.component';
import { UsersAddFilterDialogComponent } from './search-bar/add-filter/add-filter.component';
import { UsersExportDialogComponent } from './users-export-dialog/users-export-dialog.component';
import { UsersProfileSettingsComponent } from './profile/settings/settings.component';
import { UsersSettingsAdminOptionsComponent } from './profile/settings/admin-options/admin-options.component';
import { UsersSettingsStaffOptionsComponent } from './profile/settings/staff-options/staff-options.component';
import { UsersSettingsClientOptionsComponent } from './profile/settings/client-options/client-options.component';
import { UsersSettingsAdminPermissionsComponent } from './profile/settings/admin-permissions/admin-permissions.component';
import { UsersSettingsStaffPermissionsComponent } from './profile/settings/staff-permissions/staff-permissions.component';
import { UsersSettingsClientPermissionsComponent } from './profile/settings/client-permissions/client-permissions.component';
import { UsersSettingsChangePasswordComponent } from './profile/settings/change-password/change-password.component';
import { FuseChatStartComponent } from './chat/chat-start/chat-start.component';

import { MessageComponent, MessageService } from './message';
import { CustomMultiSelectGroupModule } from '../../../core/components/custom-multi-select-group/custom-multi-select-group.module';
import { CustomMultiSelectModule } from '../../../core/components/custom-multi-select/custom-multi-select.module';
import { CKEditor5Module } from '../../../core/components/ckeditor/ckeditor.module';
import { UsersProfileUnavailabilityComponent } from './profile/unavailability/unavailability.component';
import { AddUnavailabilityDialogComponent } from './profile/unavailability/add-unavailability-dialog/add-unavailability-dialog.component';
import { EditUserStatusComponent } from './profile/edit-user-status/edit-user-status.component';
import { UsersSettingsPermissionSublistComponent } from './profile/settings/permission-sublist/permission-sublist.component';
import { UsersProfileExperienceModule } from './profile/experience/experience.module';
import { UsersSettingsStaffOutsourceComponent } from './profile/settings/staff-outsource/staff-outsource.component';
import { DocumentFormsDialogComponent } from './profile/document/forms-dialog/forms-dialog.component';
import { UserPasswordDialogComponent } from './dialogs/password/password.component';
import { UsersSettingsLinkOtherAccountsComponent } from './profile/settings/link-other-accounts/link-other-accounts.component';
import { UsersProfilePayLevelsComponent } from './profile/pay-levels/pay-levels.component';
import { UsersProfileEditPayLevelComponent } from './profile/pay-levels/edit-pay-level/edit-pay-level.component';
import { UsersSettingsXtrmComponent } from './profile/settings/xtrm/xtrm.component';
import { UserSettingsXtrmAddBankDialogComponent } from './profile/settings/xtrm/dialogs/add-bank-dialog/add-bank-dialog.component';
import { TagsDialogComponent } from './profile/dialogs/tags-dialog/tags-dialog.component';
import { UsersCardsComponent } from './cards/cards.component';
import { UsersAddCardDialogComponent } from './cards/dialogs/add-card-dialog/add-card-dialog.component';
import { UsersCardSelectTagComponent } from './cards/select-tag/select-tag.component';
import { UsersPresentationsComponent } from './presentations/presentations.component';
import { UsersAddPresentationDialogComponent } from './presentations/dialogs/add-presentation-dialog/add-presentation-dialog.component';
import { AddToPresenationDialogComponent } from './dialogs/add-to-presenation-dialog/add-to-presenation-dialog.component';
import { UserWithdrawDialogComponent } from './profile/settings/xtrm/dialogs/withdraw-dialog/withdraw-dialog.component';
import { UsersProfileCardsComponent } from './profile/cards/cards.component';
import { ProfileCardsPhotoGalleryDialogComponent } from './profile/cards/dialogs/photo-gallery-dialog/photo-gallery-dialog.component';
import { ProfileCardsVideoGalleryDialogComponent } from './profile/cards/dialogs/video-gallery-dialog/video-gallery-dialog.component';
import { NewMessageDialogComponent } from './profile/dialogs/new-message-dialog/new-message-dialog.component';
import { UsersSettingsEmailSignatureComponent } from './profile/settings/email-signature/email-signature.component';
import { UsersProfileActivityComponent } from './profile/activity/activity.component';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { PrsentationEditInOutTextComponent } from './presentations/edit-in-out-text/edit-in-out-text.component';
import { UsersShowcaseViewComponent } from './showcase-view/showcase-view.component';
import { UsersProfileCalendarComponent } from '@app/main/content/users/profile/calendar/calendar.component';
import { SCCalendarModule } from '@app/core/components/sc-calendar';
import { UsersProfileCalendarEventFormDialogComponent } from '@app/main/content/users/profile/calendar/event-form/event-form.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CustomMultiSelectGroupModule,
        CustomMultiSelectModule,
        CKEditor5Module,
        UsersProfileExperienceModule,
        ClipboardModule,
        ActivityLogModule,
        SCCalendarModule
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
        UsersProfileEditCountryComponent,
        UsersProfilePhotoGalleryDialogComponent,
        UsersProfileVideoComponent,
        UsersProfileVideoGalleryDialogComponent,
        UsersProfileDocumentComponent,
        UsersProfileCalendarComponent,
        UsersProfileCalendarEventFormDialogComponent,
        UsersChatComponent,
        FuseChatViewComponent,
        FuseChatStartComponent,
        FuseChatLeftSidenavComponent,
        FuseChatChatsSidenavComponent,
        BtnAddContactComponent,
        NewThreadFormDialogComponent,
        AddUserFormDialogComponent,
        RenameThreadFormDialogComponent,
        UsersProfileAttributesComponent,
        UsersProfileWorkAreasComponent,
        UsersAddFilterDialogComponent,
        UsersExportDialogComponent,
        UsersProfileSettingsComponent,
        UsersSettingsAdminOptionsComponent,
        UsersSettingsStaffOptionsComponent,
        UsersSettingsClientOptionsComponent,
        UsersSettingsAdminPermissionsComponent,
        UsersSettingsStaffPermissionsComponent,
        UsersSettingsClientPermissionsComponent,
        UsersSettingsChangePasswordComponent,
        UsersSettingsPermissionSublistComponent,
        UsersSettingsStaffOutsourceComponent,
        UsersSettingsLinkOtherAccountsComponent,
        MessageComponent,
        UsersProfileUnavailabilityComponent,
        AddUnavailabilityDialogComponent,
        EditUserStatusComponent,
        AssignReportDialogComponent,
        DocumentFormsDialogComponent,
        UserPasswordDialogComponent,
        UsersProfilePayLevelsComponent,
        UsersProfileEditPayLevelComponent,
        UsersSettingsXtrmComponent,
        UserSettingsXtrmAddBankDialogComponent,
        TagsDialogComponent,
        UsersCardsComponent,
        UsersAddCardDialogComponent,
        UsersCardSelectTagComponent,
        UsersPresentationsComponent,
        UsersAddPresentationDialogComponent,
        AddToPresenationDialogComponent,
        UserWithdrawDialogComponent,
        UsersProfileCardsComponent,
        ProfileCardsPhotoGalleryDialogComponent,
        ProfileCardsVideoGalleryDialogComponent,
        NewMessageDialogComponent,
        UsersSettingsEmailSignatureComponent,
        UsersProfileActivityComponent,
        PrsentationEditInOutTextComponent,
        UsersShowcaseViewComponent
    ],
    exports: [
        UsersComponent,
        UsersProfileComponent,
        UsersChatComponent,
        FuseChatViewComponent,
        FuseChatStartComponent,
        FuseChatLeftSidenavComponent,
        FuseChatChatsSidenavComponent,
        BtnAddContactComponent,
        NewThreadFormDialogComponent,
        AddUserFormDialogComponent,
        RenameThreadFormDialogComponent,
        MessageComponent,
        UsersCardsComponent,
        UsersPresentationsComponent
    ],
    providers: [
        UserService,
        UsersChatService,
        MessageService
    ],
    entryComponents: [
        UserFormDialogComponent,
        UsersProfilePhotoGalleryDialogComponent,
        UsersProfileVideoGalleryDialogComponent,
        UsersProfileCalendarEventFormDialogComponent,
        UsersAddFilterDialogComponent,
        NewThreadFormDialogComponent,
        AddUserFormDialogComponent,
        RenameThreadFormDialogComponent,
        UsersExportDialogComponent,
        AddUnavailabilityDialogComponent,
        AssignReportDialogComponent,
        DocumentFormsDialogComponent,
        UserPasswordDialogComponent,
        UserSettingsXtrmAddBankDialogComponent,
        TagsDialogComponent,
        UsersAddCardDialogComponent,
        UsersAddPresentationDialogComponent,
        AddToPresenationDialogComponent,
        UserWithdrawDialogComponent,
        ProfileCardsPhotoGalleryDialogComponent,
        ProfileCardsVideoGalleryDialogComponent,
        NewMessageDialogComponent
    ]
})
export class UsersModule { }
