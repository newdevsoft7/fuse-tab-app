import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { SCCalendarModule } from '../../../core/components/sc-calendar/sc-calendar.module';
import { ScheduleComponent } from './schedule.component';
import { ScheduleCalendarComponent } from './calendar/calendar.component';
import { CalendarEventFormDialogComponent } from './calendar/event-form/event-form.component';

import { AdminShiftComponent } from './shift/admin-shift/admin-shift.component';
import { AdminShiftStaffComponent } from './shift/admin-shift/staff/staff.component';
import { AdminShiftExpensesComponent } from './shift/admin-shift/expenses/expenses.component';
import { AdminShiftTrackingComponent } from './shift/admin-shift/tracking/tracking.component';
import { AdminShiftReportsUploadsComponent } from './shift/admin-shift/reports-uploads/reports-uploads.component';
import { AdminShiftCastingsComponent } from './shift/admin-shift/castings/castings.component';
import { AdminShiftMapComponent } from './shift/admin-shift/map/map.component';

import { ScheduleService } from './schedule.service';
import { AdminShiftStaffSelectedComponent } from './shift/admin-shift/staff/selected/selected.component';
import { AdminShiftStaffNAComponent } from './shift/admin-shift/staff/na/na.component';
import { AdminShiftStaffApplicantsComponent } from './shift/admin-shift/staff/applicants/applicants.component';
import { AdminShiftStaffStandbyComponent } from './shift/admin-shift/staff/standby/standby.component';
import { NewShiftComponent } from './shift/new-shift/new-shift.component';
import { CustomMultiSelectModule } from '../../../core/components/custom-multi-select/custom-multi-select.module';
import { ShiftRoleEditComponent } from './shift/role-edit/role-edit.component';
import { ShiftRoleRequirementsComponent } from './shift/role-edit/shift-role-requirements/shift-role-requirements.component';
import { AdminShiftEditTimeComponent } from './shift/admin-shift/staff/selected/edit-time/edit-time.component';
import { AdminShiftEditBreakComponent } from './shift/admin-shift/staff/selected/edit-break/edit-break.component';

@NgModule({
	imports: [
        CommonModule,
        SCCalendarModule,
        SharedModule,
        CustomMultiSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB5zeDlcRAS67RJQZQ3tDjMZNhmD6FsQ6U'
        }),
        AgmJsMarkerClustererModule
    ],
    declarations: [
        ScheduleComponent,
        ScheduleCalendarComponent,
        CalendarEventFormDialogComponent,
        AdminShiftComponent,
        AdminShiftStaffComponent,
        AdminShiftExpensesComponent,
        AdminShiftTrackingComponent,
        AdminShiftReportsUploadsComponent,
        AdminShiftCastingsComponent,
        AdminShiftStaffSelectedComponent,
        AdminShiftStaffStandbyComponent,
        AdminShiftStaffApplicantsComponent,
        AdminShiftStaffNAComponent,
        NewShiftComponent,
        ShiftRoleEditComponent,
        ShiftRoleRequirementsComponent,
        AdminShiftMapComponent,
        AdminShiftEditTimeComponent,
        AdminShiftEditBreakComponent,
    ],
    providers: [ ScheduleService ],
    entryComponents: [ CalendarEventFormDialogComponent ],
    exports: [
        ScheduleComponent,
        ScheduleCalendarComponent,
        AdminShiftComponent,
        NewShiftComponent,
        ShiftRoleEditComponent,
        CalendarEventFormDialogComponent
    ]
})
export class ScheduleModule { }
