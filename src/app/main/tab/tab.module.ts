import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';
import { SharedModule } from '../../core/modules/shared.module';
import { TabService } from './tab.service';

@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	declarations: [
		TabsComponent,
		TabComponent,
		DynamicTabsDirective
	],
	entryComponents: [
		TabComponent
	],
	exports: [
		TabsComponent,
		TabComponent,
		DynamicTabsDirective
	],
	providers: [
		TabService
	]
})
export class TabModule { }
