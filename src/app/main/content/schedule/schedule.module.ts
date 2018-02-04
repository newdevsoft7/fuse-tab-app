import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { SCCalendarModule } from '../../../core/components/sc-calendar/sc-calendar.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleCalendarComponent } from './calendar/calendar.component';
import { CalendarEventFormDialogComponent } from './calendar/event-form/event-form.component';

import { ScheduleShiftComponent } from './shift/shift.component';
import { ScheduleShiftStaffComponent } from './shift/staff/staff.component';
import { ScheduleShiftExpensesComponent } from './shift/expenses/expenses.component';
import { ScheduleShiftTrackingComponent } from './shift/tracking/tracking.component';
import { ScheduleShiftReportsUploadsComponent } from './shift/reports-uploads/reports-uploads.component';
import { ScheduleShiftCastingsComponent } from './shift/castings/castings.component';

import { ScheduleService } from './schedule.service';
import { ScheduleShiftStaffSelectedComponent } from './shift/staff/selected/selected.component';
import { ScheduleShiftStaffNAComponent } from './shift/staff/na/na.component';
import { ScheduleShiftStaffApplicantsComponent } from './shift/staff/applicants/applicants.component';
import { ScheduleShiftStaffStandbyComponent } from './shift/staff/standby/standby.component';

@NgModule({
	imports: [
        CommonModule,
        SCCalendarModule,
        SharedModule
    ],
    declarations: [
        ScheduleComponent,
        ScheduleCalendarComponent,
        CalendarEventFormDialogComponent,
        ScheduleShiftComponent,
        ScheduleShiftStaffComponent,
        ScheduleShiftExpensesComponent,
        ScheduleShiftTrackingComponent,
        ScheduleShiftReportsUploadsComponent,
        ScheduleShiftCastingsComponent,
        ScheduleShiftStaffSelectedComponent,
        ScheduleShiftStaffStandbyComponent,
        ScheduleShiftStaffApplicantsComponent,
        ScheduleShiftStaffNAComponent
    ],
    providers: [ ScheduleService ],
    entryComponents: [ CalendarEventFormDialogComponent ],
    exports: [
        ScheduleComponent,
        ScheduleCalendarComponent,
        ScheduleShiftComponent,
        CalendarEventFormDialogComponent
    ]
})
export class ScheduleModule { }
