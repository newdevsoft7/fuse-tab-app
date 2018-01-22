import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersExportsComponent } from './exports/exports.component';
import { UsersPresentationsComponent } from './presentations/presentations.component';
import { SharedModule } from '../../../core/modules/shared.module';
import { UserService } from './user.service';
import { UserFormDialogComponent } from './dialogs/user-form/user-form.component';
import { UsersProfileComponent } from './profile/profile.component';
import { UsersProfileAboutComponent } from './profile/about/about.component';
import { UsersProfilePhotoComponent } from './profile/photo/photo.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    declarations: [
        UsersComponent,
        UsersExportsComponent,
        UsersPresentationsComponent,
        UserFormDialogComponent,
        UsersProfileComponent,
        UsersProfileAboutComponent,
        UsersProfilePhotoComponent
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
        UserFormDialogComponent
    ]
})
export class UsersModule { }
