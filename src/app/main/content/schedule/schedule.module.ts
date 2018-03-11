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
import { StaticMultiSelectModule } from '../../../core/components/static-multi-select/static-multi-select.module';
import { ShiftRoleEditComponent } from './shift/role-edit/role-edit.component';
import { ShiftRoleRequirementsComponent } from './shift/role-edit/shift-role-requirements/shift-role-requirements.component';
import { AdminShiftEditTimeComponent } from './shift/admin-shift/staff/selected/edit-time/edit-time.component';
import { AdminShiftEditBreakComponent } from './shift/admin-shift/staff/selected/edit-break/edit-break.component';
import { AdminShiftEditPayitemsComponent } from './shift/admin-shift/staff/selected/edit-payitems/edit-payitems.component';
import { AdminShiftEditBillitemsComponent } from './shift/admin-shift/staff/selected/edit-billitems/edit-billitems.component';
import { AdminShiftEditGenericTitleComponent } from './shift/admin-shift/edit-generic-title/edit-generic-title.component';
import { AdminShiftEditGenericLocationComponent } from './shift/admin-shift/edit-generic-location/edit-generic-location.component';
import { AdminShiftEditAddressComponent } from './shift/admin-shift/edit-address/edit-address.component';
import { AdminShiftEditContactComponent } from './shift/admin-shift/edit-contact/edit-contact.component';
import { AdminShiftEditTitleComponent } from './shift/admin-shift/edit-title/edit-title.component';
import { AdminShiftEditPeriodComponent } from './shift/admin-shift/edit-period/edit-period.component';
import { AdminShiftEditManagersComponent } from './shift/admin-shift/edit-managers/edit-managers.component';
import { AdminShiftListComponent } from './shift-list/admin-shift-list/admin-shift-list.component';
import { ShiftsExportAsExcelComponent } from './shifts-export/shifts-export-as-excel/shifts-export-as-excel.component';
import { ShiftsExportAsPdfComponent } from './shifts-export/shifts-export-as-pdf/shifts-export-as-pdf.component';

// Staff Shift Components
import { StaffShiftComponent } from './shift/staff-shift/staff-shift.component';
import { StaffShiftInfoComponent } from './shift/staff-shift/info/info.component';
import { StaffShiftReplaceDialogComponent } from './shift/staff-shift/info/dialogs/replace-dialog/replace-dialog.component';
import { StaffShiftConfirmDialogComponent } from './shift/staff-shift/info/dialogs/confirm-dialog/confirm-dialog.component';
import { StaffShiftPayItemDialogComponent } from './shift/staff-shift/info/dialogs/pay-item-dialog/pay-item-dialog.component';
import { StaffShiftMapComponent } from './shift/staff-shift/map/map.component';
import { StaffShiftApplyDialogComponent } from './shift/staff-shift/info/dialogs/apply-dialog/apply-dialog.component';
import { EditShiftComponent } from './shift/edit-shift/edit-shift.component';
import { EditShiftDetailComponent } from './shift/edit-shift/edit-shift-detail/edit-shift-detail.component';
import { EditShiftRoleDetailComponent } from './shift/edit-shift/edit-shift-role-detail/edit-shift-role-detail.component';

// Client
import { ClientShiftListComponent } from './shift-list/client-shift-list/client-shift-list.component';
import { ShiftsImportComponent } from './shifts-import/shifts-import.component';
import { ClientNewBookingComponent } from './new-booking/client-new-booking/client-new-booking.component';
import { ClientShiftComponent } from './shift/client-shift/client-shift.component';
import { ClientShiftMapComponent } from './shift/client-shift/map/map.component';
import { ClientShiftInfoComponent } from './shift/client-shift/info/info.component';
import { ShiftsExportAsExcelDialogComponent } from './shifts-export/client/shifts-export-as-excel-dialog/shifts-export-as-excel-dialog.component';
import { ShiftsExportAsPdfDialogComponent } from './shifts-export/client/shifts-export-as-pdf-dialog/shifts-export-as-pdf-dialog.component';


@NgModule({
	imports: [
        CommonModule,
        SCCalendarModule,
        SharedModule,
        CustomMultiSelectModule,
        StaticMultiSelectModule,
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
        AdminShiftEditPayitemsComponent,
        AdminShiftEditBillitemsComponent,
        AdminShiftEditGenericTitleComponent,
        AdminShiftEditGenericLocationComponent,
        AdminShiftEditAddressComponent,
        AdminShiftEditContactComponent,
        AdminShiftEditTitleComponent,
        AdminShiftEditPeriodComponent,
        AdminShiftEditManagersComponent,
        AdminShiftListComponent,
        EditShiftComponent,
        ShiftsImportComponent,
        ShiftsExportAsExcelComponent,
        ShiftsExportAsPdfComponent,
        
        // Staff view of shift
        StaffShiftComponent,
        StaffShiftInfoComponent,
        StaffShiftReplaceDialogComponent,
        StaffShiftConfirmDialogComponent,
        StaffShiftPayItemDialogComponent,
        StaffShiftMapComponent,
        StaffShiftApplyDialogComponent,
        EditShiftDetailComponent,
        EditShiftRoleDetailComponent,
        
        // Client view
        ClientShiftListComponent,
        ClientNewBookingComponent,
        ClientShiftComponent,
        ClientShiftMapComponent,
        ClientShiftInfoComponent,
        ShiftsExportAsExcelDialogComponent,
        ShiftsExportAsPdfDialogComponent

    ],
    providers: [ ScheduleService ],
    entryComponents: [
        CalendarEventFormDialogComponent,

        // Staff view of shift
        StaffShiftReplaceDialogComponent,
        StaffShiftConfirmDialogComponent,
        StaffShiftPayItemDialogComponent,
        StaffShiftApplyDialogComponent,

        // Client
        ShiftsExportAsExcelDialogComponent,
        ShiftsExportAsPdfDialogComponent
    ],
    exports: [
        ScheduleComponent,
        ScheduleCalendarComponent,
        AdminShiftComponent,
        NewShiftComponent,
        EditShiftComponent,
        ShiftRoleEditComponent,
        CalendarEventFormDialogComponent,
        StaffShiftComponent,
        AdminShiftListComponent,
        ClientShiftListComponent,
        ClientNewBookingComponent,
        ClientShiftComponent,
        ShiftsImportComponent,
        ShiftsExportAsExcelComponent,
        ShiftsExportAsPdfComponent
    ]
})
export class ScheduleModule { }
