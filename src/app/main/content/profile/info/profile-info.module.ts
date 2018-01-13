import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../core/modules/shared.module';

import { ProfileInfoService } from './profile-info.service';

import { ProfileInfoComponent } from './profile-info.component';

@NgModule({
	imports: [
        CommonModule,
        SharedModule

	],
	declarations: [
		ProfileInfoComponent
    ],
    exports: [
        ProfileInfoComponent
    ],
    providers: [
        ProfileInfoService
    ]
})
export class ProfileInfoModule { }
