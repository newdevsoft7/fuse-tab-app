import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';

import { ProfileComponent } from './profile.component';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
	],
	declarations: [
		ProfileComponent
	],
	exports: [
		ProfileComponent
	]
})
export class ProfileModule { }
