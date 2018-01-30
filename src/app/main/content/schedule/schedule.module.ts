import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SCCalendarModule } from '../../../core/components/sc-calendar/sc-calendar.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleCalendarComponent } from './calendar/calendar.component';

@NgModule({
	imports: [
    CommonModule,
    SCCalendarModule
	],
	declarations: [
    ScheduleComponent,
    ScheduleCalendarComponent
	],
	exports: [
    ScheduleComponent,
    ScheduleCalendarComponent
	]
})
export class ScheduleModule { }
