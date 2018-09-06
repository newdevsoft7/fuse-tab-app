import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../../schedule.service';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { GroupStaffComponent } from './staff/staff.component';
import { ActionService } from '../../../../../shared/services/action.service';
import { ShiftListEmailDialogComponent } from '../../shift-list/admin-shift-list/email-dialog/email-dialog.component';
import { AdminExportAsPdfDialogComponent } from '../../shifts-export/admin/export-as-pdf-dialog/export-as-pdf-dialog.component';
import { AdminExportAsExcelDialogComponent } from '../../shifts-export/admin/export-as-excel-dialog/export-as-excel-dialog.component';

export enum TAB {
    Staff = 'Staff',
    Bill = 'Bill',
    Reports = 'Reports & Uploads',
    Attachements = 'Attachments'
}

@Component({
    selector: 'app-admin-shift-group',
    templateUrl: './admin-shift-group.component.html',
    styleUrls: ['./admin-shift-group.component.scss']
})
export class AdminShiftGroupComponent implements OnInit, OnDestroy {

    @Input() data;
    @ViewChild('staffTab') staffTab: GroupStaffComponent;

    group: any;
    shifts: any[] = [];
    clients: any[] = [];
    shiftData: any; // For edit tracking & work areas
    selectedTabIndex: number = 0; // Set staff tab as initial tab
    usersToInviteSubscription: Subscription;
    usersToSelectSubscription: Subscription;
    showMoreBtn = true;

    constructor(
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private actionService: ActionService,
        private dialog: MatDialog
    ) { }

    ngOnDestroy() {
        this.usersToInviteSubscription.unsubscribe();
        this.usersToSelectSubscription.unsubscribe();
    }
    
    ngOnInit() {
        this.fetchGroup();

        // Get Tracking Categories & Options
        this.scheduleService.getShiftsData().subscribe(res => {
            this.shiftData = res;
        });

        // Get Clients
        this.scheduleService.getClients('').subscribe(res => {
            this.clients = res;
        });

        // Invite Users to Role
        this.usersToInviteSubscription = this.actionService.usersToInvite.subscribe(
            ({ shiftId, userIds, filters, role, inviteAll }) => {
                const index = this.shifts.findIndex(v => v.id === shiftId);
                if (index > -1) {
                    this.selectedTabIndex = 0; // Set staff tab active
                    this.staffTab.inviteStaffs({ shiftId, userIds, filters, role, inviteAll });
                }
            });

        // add Users to Role
        this.usersToSelectSubscription = this.actionService.usersToSelect.subscribe(
            ({ shiftId, userIds, role }) => {
                const index = this.shifts.findIndex(v => v.id === shiftId);
                if (index > -1) {
                    this.selectedTabIndex = 0; // Set staff tab active
                    this.staffTab.selectStaffs({ shiftId, userIds, role });
                }
            });
    }

    async fetchGroup() {
        try {
            this.spinner.show();
            const res = await this.scheduleService.getShiftGroup(this.data.id);
            this.group = res.group;
            this.shifts = res.shifts;
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            this.displayError(e);
        }
    }

    async toggleLive() {
        const live = this.group.live === 1 ? 0 : 1;
        try {
            const res = await this.scheduleService.updateShiftGroup(this.group.id, { live });
            //this.toastr.success(res.message);
            this.group.live = live;
        } catch (e) {
            this.displayError(e);
        }
    }

    async toggleFlag(flag) {
        const value = flag.set === 1 ? 0 : 1;
        try {
            const res = await this.scheduleService.setGroupFlag(this.group.id, flag.id, value);
            //this.toastr.success(res.message);
            flag.set = value;
        } catch (e) {
            this.displayError(e);
        }
    }

    async toggleLock() {
        const locked = this.group.locked === 1 ? 0 : 1;
        try {
            const res = await this.scheduleService.updateShiftGroup(this.group.id, { locked });
            //this.toastr.success(res.message);
            this.group.locked = locked;
        } catch (e) {
            this.displayError(e);
        }
    }

    message(type) {
        const dialogRef = this.dialog.open(ShiftListEmailDialogComponent, {
            disableClose: false,
            panelClass: 'admin-shift-email-dialog',
            data: {
                shiftIds: this.shifts.map(v => v.id),
                type
            }
        });
        dialogRef.afterClosed().subscribe(res => {});
    }

    openExportCsvDialog() {
        const dialogRef = this.dialog.open(AdminExportAsExcelDialogComponent, {
            panelClass: 'admin-shift-exports-as-excel-dialog',
            disableClose: false,
            data: {
                shiftIds: this.shifts.map(v => v.id),
                isGroup: true
            }
        });

        dialogRef.afterClosed().subscribe(res => { });
    }

    openOverviewDialog() {
        const dialogRef = this.dialog.open(AdminExportAsPdfDialogComponent, {
            panelClass: 'admin-shift-exports-as-pdf-dialog',
            disableClose: false,
            data: {
                shiftIds: this.shifts.map(v => v.id),
                isGroup: true
            }
        });

        dialogRef.afterClosed().subscribe(res => { });
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }

}
