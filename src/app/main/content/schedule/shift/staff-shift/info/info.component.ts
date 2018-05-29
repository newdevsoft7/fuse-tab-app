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

import { ScheduleService } from '../../../schedule.service';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import * as _ from 'lodash';

// Action Dialogs
import { StaffShiftReplaceDialogComponent } from './dialogs/replace-dialog/replace-dialog.component';
import { StaffShiftConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { StaffShiftPayItemDialogComponent } from './dialogs/pay-item-dialog/pay-item-dialog.component';
import { StaffShiftApplyDialogComponent } from './dialogs/apply-dialog/apply-dialog.component';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { StaffShiftCheckInOutDialogComponent } from './dialogs/check-in-out-dialog/check-in-out-dialog.component';
import { StaffShiftCompleteDialogComponent } from './dialogs/complete-dialog/complete-dialog.component';

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
    settings: any = {};

	constructor(
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage
    ) { }

	ngOnInit() {
        this.settings = this.tokenStorage.getSettings();
    }

    openPayItemDialog(payItems) {
        this.dialogRef = this.dialog.open(StaffShiftPayItemDialogComponent, {
            data: { payItems }
        });
        this.dialogRef.afterClosed().subscribe(_ => {});
    }

    sum(payItems: any[]) {
        return payItems.reduce((ac, item) => ac + item.total, 0);
    }

    getStyle(action) {
        let style;
        switch(action) {
            case Action.confirm:
            case Action.apply:
                style = 'mat-accent-bg'
                break;

            case Action.replace:
            case Action.not_available:
                style = 'mat-warn-bg';
                break;


            default:
                style = 'mat-primary-50-bg';
                break;
        }

        return style;
    }

    doAction(action, role) {
        let dialogRef;

        switch (action) {
            case Action.apply:
                this.dialogRef = this.dialog.open(StaffShiftApplyDialogComponent, {
                    panelClass: 'staff-shift-apply-dialog',
                    data: {
                        forms: this.shift.forms_apply,
                        shift_id: this.shift.id
                    }
                });
                this.dialogRef.afterClosed().subscribe(reason => {
                    if (reason) {
                        this.scheduleService.applyShiftRole(role.id, reason)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                                role.role_staff_id = res.id;
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.cancel_application:
                dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                    disableClose: false
                });
                dialogRef.componentInstance.confirmMessage = 'Really cancel your application?';
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.applyCancelShiftRole(roleStaffId)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                                delete role.role_staff_id;
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.not_available:
                this.scheduleService.notAvailableShiftRole(role.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    role.message = res.role_message;
                    role.actions = [...res.actions];
                    role.role_staff_id = res.id;
                }, err => this.displayError(err));
                break;

            case Action.confirm:
                this.dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
                    data: {
                        title: 'Really confirm this role?',
                        heading: this.settings.shift_msg_confirmation,
                        forms: this.shift.forms_confirm,
                        shift_id: this.shift.id
                    }
                });
                this.dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.confirmStaffSelection(roleStaffId)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions]
                            }, err => this.displayError(err));
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
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.cancel_replace:
                dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                    disableClose: false
                });
                dialogRef.componentInstance.confirmMessage = 'Really cancel your application?';
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.replaceCancelShiftRole(roleStaffId)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions]
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.cancel_replace_standby:

                break;

            case Action.check_in:
                dialogRef = this.dialog.open(StaffShiftCheckInOutDialogComponent, {
                    disableClose: false,
                    panelClass: 'staff-shift-check-in-out-dialog',
                    data: {
                        mode: 'checkin'
                    }
                });
                dialogRef.afterClosed().subscribe(async(result) => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        try {
                            const res = await this.scheduleService.checkInShiftRole(roleStaffId, result);
                            //this.toastr.success(res.message);
                            role.message = res.role_message;
                            role.actions = [...res.actions]
                        } catch (e) {
                            this.displayError(e);
                        }
                    }
                });
                break;

            case Action.check_out:
                dialogRef = this.dialog.open(StaffShiftCheckInOutDialogComponent, {
                    disableClose: false,
                    panelClass: 'staff-shift-check-in-out-dialog',
                    data: {
                        mode: 'checkout'
                    }
                });
                dialogRef.afterClosed().subscribe(async(result) => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        try {
                            const res = await this.scheduleService.checkOutShiftRole(roleStaffId, result);
                            //this.toastr.success(res.message);
                            role.message = res.role_message;
                            role.actions = [...res.actions]
                        } catch (e) {
                            this.displayError(e);
                        }
                    }
                });
                break;

            case Action.complete:
                dialogRef = this.dialog.open(StaffShiftCompleteDialogComponent, {
                    disableClose: false,
                    panelClass: 'staff-shift-complete-dialog',
                    data: {
                        roleStaffId: role.role_staff_id
                    }
                });
                dialogRef.afterClosed().subscribe(async(result) => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        try {
                            const res = await this.scheduleService.completeShiftRole(roleStaffId);
                            role.message = res.role_message;
                            role.actions = [...res.actions];
                        } catch (e) {
                            this.displayError(e);
                        }
                    }
                });
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

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
