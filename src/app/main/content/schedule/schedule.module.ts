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
import { AdminShiftBillComponent } from './shift/admin-shift/bill/bill.component';
import { AdminShiftAttachmentsComponent } from './shift/admin-shift/attachments/attachments.component';
import { AdminShiftReportsUploadsComponent } from './shift/admin-shift/reports-uploads/reports-uploads.component';
import { AdminShiftMapComponent } from './shift/admin-shift/map/map.component';

import { ScheduleService } from './schedule.service';
import { AdminShiftStaffSelectedComponent } from './shift/admin-shift/staff/selected/selected.component';
import { AdminShiftStaffNAComponent } from './shift/admin-shift/staff/na/na.component';
import { AdminShiftStaffApplicantsComponent } from './shift/admin-shift/staff/applicants/applicants.component';
import { AdminShiftStaffStandbyComponent } from './shift/admin-shift/staff/standby/standby.component';
import { NewShiftComponent } from './shift/new-shift/new-shift.component';
import { CustomMultiSelectModule } from '../../../core/components/custom-multi-select/custom-multi-select.module';
import { CustomMultiSelectGroupModule } from '../../../core/components/custom-multi-select-group/custom-multi-select-group.module';
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
import { AdminShiftStaffInvitedComponent } from './shift/admin-shift/staff/invited/invited.component';
import { EditTrackingComponent } from './shift/admin-shift/edit-tracking/edit-tracking.component';
import { EditTrackingDialogComponent } from './shift/admin-shift/edit-tracking/edit-tracking-dialog/edit-tracking-dialog.component';
import { EditWorkareasComponent } from './shift/admin-shift/edit-workareas/edit-workareas.component';
import { EditWorkareasDialogComponent } from './shift/admin-shift/edit-workareas/edit-workareas-dialog/edit-workareas-dialog.component';
import { CKEditor5Module } from '../../../core/components/ckeditor/ckeditor.module';
import { AdminShiftEditClientComponent } from './shift/admin-shift/edit-client/edit-client.component';
import { AddPayItemDialogComponent } from './shift/admin-shift/staff/selected/add-pay-item-dialog/add-pay-item-dialog.component';
import { EditPayItemNameComponent } from './shift/admin-shift/staff/selected/edit-pay-item-name/edit-pay-item-name.component';
import { EditPayItemUnitsComponent } from './shift/admin-shift/staff/selected/edit-pay-item-units/edit-pay-item-units.component';
import { EditPayItemUnitRateComponent } from './shift/admin-shift/staff/selected/edit-pay-item-unit-rate/edit-pay-item-unit-rate.component';
import { EditBillItemNameComponent } from './shift/admin-shift/bill/edit-item-name/edit-item-name.component';
import { EditBillItemUnitRateComponent } from './shift/admin-shift/bill/edit-item-unit-rate/edit-item-unit-rate.component';
import { EditBillItemUnitsComponent } from './shift/admin-shift/bill/edit-item-units/edit-item-units.component';
import { EditBillItemRateTypeComponent } from './shift/admin-shift/bill/edit-item-rate-type/edit-item-rate-type.component';
import { ColumnMappingComponent } from './column-mapping/column-mapping.component';
import { ImportHistoryComponent } from './import-history/import-history.component';
import { AdminShiftEditPerformanceNoteComponent } from './shift/admin-shift/staff/selected/edit-performance-note/edit-performance-note.component';
import { GroupDialogComponent } from './shift-list/admin-shift-list/group-dialog/group-dialog.component';
import { AdminShiftGroupComponent } from './shift/admin-shift-group/admin-shift-group.component';
import { GroupEditNameComponent } from './shift/admin-shift-group/edit-name/edit-name.component';
import { GroupEditGenericLocationComponent } from './shift/admin-shift-group/edit-generic-location/edit-generic-location.component';
import { GroupEditLocationComponent } from './shift/admin-shift-group/edit-location/edit-location.component';
import { GroupEditAddressComponent } from './shift/admin-shift-group/edit-address/edit-address.component';
import { GroupEditContactComponent } from './shift/admin-shift-group/edit-contact/edit-contact.component';
import { GroupEditManagersComponent } from './shift/admin-shift-group/edit-managers/edit-managers.component';
import { GroupEditClientComponent } from './shift/admin-shift-group/edit-client/edit-client.component';
import { GroupEditTrackingComponent } from './shift/admin-shift-group/edit-tracking/edit-tracking.component';
import { GroupEditTrackingDialogComponent } from './shift/admin-shift-group/edit-tracking/edit-tracking-dialog/edit-tracking-dialog.component';
import { GroupEditWorkareasComponent } from './shift/admin-shift-group/edit-workareas/edit-workareas.component';
import { GroupEditWorkareasDialogComponent } from './shift/admin-shift-group/edit-workareas/edit-workareas-dialog/edit-workareas-dialog.component';
import { GroupStaffComponent } from './shift/admin-shift-group/staff/staff.component';
import { GroupAttachmentsComponent } from './shift/admin-shift-group/attachments/attachments.component';
import { GroupReportsUploadsComponent } from './shift/admin-shift-group/reports-uploads/reports-uploads.component';
import { GroupSelectShiftDialogComponent } from './shift/admin-shift-group/reports-uploads/select-shift-dialog/select-shift-dialog.component';
import { StaffShiftReportsUploadsComponent } from './shift/staff-shift/reports-uploads/reports-uploads.component';
import { StaffShiftCheckInOutDialogComponent } from './shift/staff-shift/info/dialogs/check-in-out-dialog/check-in-out-dialog.component';
import { AdminExportAsExcelDialogComponent } from './shifts-export/admin/export-as-excel-dialog/export-as-excel-dialog.component';
import { AdminExportAsPdfDialogComponent } from './shifts-export/admin/export-as-pdf-dialog/export-as-pdf-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        SCCalendarModule,
        SharedModule,
        CustomMultiSelectModule,
        CustomMultiSelectGroupModule,
        StaticMultiSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB5zeDlcRAS67RJQZQ3tDjMZNhmD6FsQ6U'
        }),
        AgmJsMarkerClustererModule,
        CKEditor5Module
    ],
    declarations: [
        ScheduleComponent,
        ScheduleCalendarComponent,
        CalendarEventFormDialogComponent,
        AdminShiftComponent,
        AdminShiftStaffComponent,
        AdminShiftBillComponent,
        AdminShiftReportsUploadsComponent,
        AdminShiftStaffSelectedComponent,
        AdminShiftStaffStandbyComponent,
        AdminShiftStaffApplicantsComponent,
        AdminShiftStaffInvitedComponent,
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
        ShiftsExportAsPdfComponent,

        // Staff view of shift
        StaffShiftComponent,
        StaffShiftInfoComponent,
        StaffShiftReportsUploadsComponent,
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
        ShiftsExportAsPdfDialogComponent,
        EditTrackingComponent,
        EditTrackingDialogComponent,
        EditWorkareasComponent,
        EditWorkareasDialogComponent,
        AdminShiftEditClientComponent,
        AddPayItemDialogComponent,
        EditPayItemNameComponent,
        EditPayItemUnitsComponent,
        EditPayItemUnitRateComponent,
        AdminShiftAttachmentsComponent,
        EditBillItemNameComponent,
        EditBillItemUnitRateComponent,
        EditBillItemUnitsComponent,
        EditBillItemRateTypeComponent,
        ColumnMappingComponent,
        ImportHistoryComponent,
        AdminShiftEditPerformanceNoteComponent,
        GroupDialogComponent,
        AdminShiftGroupComponent,
        GroupEditNameComponent,
        GroupEditGenericLocationComponent,
        GroupEditLocationComponent,
        GroupEditAddressComponent,
        GroupEditContactComponent,
        GroupEditManagersComponent,
        GroupEditClientComponent,
        GroupEditTrackingComponent,
        GroupEditTrackingDialogComponent,
        GroupEditWorkareasComponent,
        GroupEditWorkareasDialogComponent,
        GroupStaffComponent,
        GroupAttachmentsComponent,
        GroupReportsUploadsComponent,
        GroupSelectShiftDialogComponent,
        StaffShiftCheckInOutDialogComponent,
        AdminExportAsExcelDialogComponent,
        AdminExportAsPdfDialogComponent,
    ],
    providers: [ ScheduleService ],
    entryComponents: [
        CalendarEventFormDialogComponent,

        // Staff view of shift
        StaffShiftReplaceDialogComponent,
        StaffShiftConfirmDialogComponent,
        StaffShiftPayItemDialogComponent,
        StaffShiftApplyDialogComponent,
        StaffShiftCheckInOutDialogComponent,

        // Client
        ShiftsExportAsExcelDialogComponent,
        ShiftsExportAsPdfDialogComponent,

        EditTrackingDialogComponent,
        EditWorkareasDialogComponent,
        AddPayItemDialogComponent,
        GroupDialogComponent,
        GroupEditTrackingDialogComponent,
        GroupEditWorkareasDialogComponent,
        GroupSelectShiftDialogComponent,
        AdminExportAsExcelDialogComponent,
        AdminExportAsPdfDialogComponent
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
        ShiftsExportAsPdfComponent,
        ColumnMappingComponent,
        ImportHistoryComponent,
        AdminShiftGroupComponent
    ]
})
export class ScheduleModule { }
