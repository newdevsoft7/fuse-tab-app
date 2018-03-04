import {
    Component, OnInit,
    ViewEncapsulation, Input,
    DoCheck, IterableDiffers,
    ViewChild
} from '@angular/core';

import {
    MatDialog, MatDialogRef,
    MAT_DIALOG_DATA,
    MatTabChangeEvent
} from '@angular/material';

import { ToastrService } from 'ngx-toastr';

import { StaffStatus } from '../../../../../../constants/staff-status-id';
import { ScheduleService } from '../../../schedule.service';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import * as _ from 'lodash';

// Action Dialogs
import { StaffShiftReplaceDialogComponent } from './dialogs/replace-dialog/replace-dialog.component';
import { StaffShiftConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { StaffShiftPayItemDialogComponent } from './dialogs/pay-item-dialog/pay-item-dialog.component';
import { StaffShiftApplyDialogComponent } from './dialogs/apply-dialog/apply-dialog.component';

enum Action {
    apply = 'apply',
    cancel_application = 'cancel_application',
    not_available = 'not_available',
    confirm = 'confirm',
    replace = 'replace',
    cancel_replace = 'cancel_replace',
    cancel_replace_standby = 'cancel_replace_standby',
    check_in = 'check_in',
    check_out = 'check_out',
    complete = 'complete',
    expenses = 'expenses',
    invoice = 'invoice',
    view_invoice = 'view_invoice',
    view_pay = 'view_pay',
    reports = 'reports',
    uploads = 'uploads'
}

@Component({
	selector: 'app-staff-shift-info',
	templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftInfoComponent implements OnInit {

    @Input() shift;

    dialogRef: any;

    readonly Action = Action;

	constructor(
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

	ngOnInit() {
    }

    readonly files = [
        { type: 'document', name: 'work', size: '1.2 MB', created_at: 'June 8, 2018' },
        { type: 'spreadsheet', name: 'tax', size: '1.9 MB', created_at: 'June 8, 2018' },
        { type: 'spreadsheet', name: 'offer', size: '45 MB', created_at: 'June 8, 2018' },
        { type: 'document', name: 'work', size: '1.8 Mb', created_at: 'June 8, 2018' },
        { type: 'spreadsheet', name: 'intro', size: '3.2 Mb', created_at: 'June 8, 2018' },
        { type: 'document', name: 'work', size: '22 Mb', created_at: 'June 8, 2018' }
    ]
    
    openPayItemDialog(payItems) {
        this.dialogRef = this.dialog.open(StaffShiftPayItemDialogComponent, {
            data: { payItems }
        });
        this.dialogRef.afterClosed().subscribe(_ => {});
    }

    sum(payItems: any[]) {
        return payItems.reduce((ac, item) => ac + item.total, 0);
    }

    doAction(action, role) {
        switch (action) {
            case Action.apply:
                this.dialogRef = this.dialog.open(StaffShiftApplyDialogComponent, {
                    panelClass: 'staff-shift-apply-dialog'
                });
                this.dialogRef.afterClosed().subscribe(reason => {
                    if (reason !== false) {
                        this.scheduleService.applyShiftRole(role.id, reason)
                            .subscribe(res => {
                                this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                                role.role_staff_id = res.id;
                            });
                    }
                });
                break;

            case Action.cancel_application:
                this.dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
                    data: {
                        title: 'Really cancel your application?'
                    }
                });
                this.dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.applyCancelShiftRole(roleStaffId)
                            .subscribe(res => {
                                this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                                delete role.role_staff_id;
                            });
                    }
                });
                break;

            case Action.not_available:
                this.scheduleService.notAvailableShiftRole(role.id).subscribe(res => {
                    this.toastr.success(res.message);
                    role.message = res.role_message;
                    role.actions = [...res.actions];
                    role.role_staff_id = res.id;
                }, err => {
                    this.toastr.error(err.error.message);
                });
                break;

            case Action.confirm:
                this.dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
                    data: {
                        title: 'Really confirm this role?',
                        heading: 'Thank you for confirming your shift.'
                    }
                });
                this.dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.confirmStaffSelection(roleStaffId)
                            .subscribe(res => {
                                this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions]
                            });
                    }
                });
                break;

            case Action.replace:
                this.dialogRef = this.dialog.open(StaffShiftReplaceDialogComponent, {
                    panelClass: 'staff-shift-replace-dialog'
                });
                this.dialogRef.afterClosed().subscribe(reason => {
                    if (reason) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.replaceShiftRole(roleStaffId, reason)
                            .subscribe(res => {
                                this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                            });
                    }
                });
                break;

            case Action.cancel_replace:
                this.dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
                    data: { title: 'Cancel your replacement request?'}
                });
                this.dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.replaceCancelShiftRole(roleStaffId)
                            .subscribe(res => {
                                this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions]
                            });
                    }
                });
                break;

            case Action.cancel_replace_standby:

                break;

            case Action.check_in:

                break;

            case Action.check_out:
                this.dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
                    data: { title: 'Really check out from this role?' }
                });
                this.dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.checkOutShiftRole(roleStaffId)
                            .subscribe(res => {
                                this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions]
                            }, err => {
                                this.toastr.error(err.error.message);
                            });
                    }
                });
                break;

            case Action.complete:

                break;

            case Action.expenses:

                break;

            case Action.invoice:

                break;

            case Action.view_invoice:

                break;
                
            case Action.view_pay:

                break;

            case Action.reports:

                break;

            case Action.uploads:

                break;

            default:
                break;
        }
    }

}
