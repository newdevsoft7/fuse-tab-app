import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { SCCalendarModule } from '../../../core/components/sc-calendar/sc-calendar.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleCalendarComponent } from './calendar/calendar.component';
import { CalendarEventFormDialogComponent } from './calendar/event-form/event-form.component';

@NgModule({
	imports: [
    CommonModule,
    SCCalendarModule,
    SharedModule
	],
	declarations: [
    ScheduleComponent,
    ScheduleCalendarComponent,
    CalendarEventFormDialogComponent
  ],
  entryComponents: [ CalendarEventFormDialogComponent ],
	exports: [
    ScheduleComponent,
    ScheduleCalendarComponent,
    CalendarEventFormDialogComponent
	]
})
export class ScheduleModule { }
