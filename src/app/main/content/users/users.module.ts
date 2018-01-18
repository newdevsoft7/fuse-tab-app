import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersExportsComponent } from './exports/exports.component';
import { UsersPresentationsComponent } from './presentations/presentations.component';
import { SharedModule } from '../../../core/modules/shared.module';
import { UserService } from './user.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        UsersComponent,
        UsersExportsComponent,
        UsersPresentationsComponent
    ],
    exports: [
        UsersComponent,
        UsersExportsComponent,
        UsersPresentationsComponent
    ],
    providers: [
        UserService
    ]
})
export class UsersModule { }
