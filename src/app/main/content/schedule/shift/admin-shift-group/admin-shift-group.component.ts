import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../../schedule.service';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
import { GroupStaffComponent } from './staff/staff.component';
import { ActionService } from '../../../../../shared/services/action.service';
import { ShiftListEmailDialogComponent } from '../../shift-list/admin-shift-list/email-dialog/email-dialog.component';
import { AdminExportAsPdfDialogComponent } from '../../shifts-export/admin/export-as-pdf-dialog/export-as-pdf-dialog.component';
import { AdminExportAsExcelDialogComponent } from '../../shifts-export/admin/export-as-excel-dialog/export-as-excel-dialog.component';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';
import { AddUserToGroupDialogComponent } from './dialogs/add-user-to-group-dialog/add-user-to-group-dialog.component';
import { GroupActivityComponent } from './activity/activity.component';

export enum TAB {
  Staff = 'Staff',
  Bill = 'Bill',
  Reports = 'Reports & Uploads',
  Attachements = 'Attachments',
  Activity = 'Activity'
}

@Component({
  selector: 'app-admin-shift-group',
  templateUrl: './admin-shift-group.component.html',
  styleUrls: ['./admin-shift-group.component.scss']
})
export class AdminShiftGroupComponent implements OnInit, OnDestroy {

  @Input() data;
  @ViewChild('staffTab') staffTab: GroupStaffComponent;
  @ViewChild('activityTab') activityTab: GroupActivityComponent;


  group: any;
  shifts: any[] = [];
  clients: any[] = [];
  shiftData: any; // For edit tracking & work areas
  selectedTabIndex: number = 0; // Set staff tab as initial tab
  usersToInviteSubscription: Subscription;
  usersToSelectSubscription: Subscription;
  userToGroupSubscription: Subscription;
  showMoreBtn = true;

  constructor(
    private spinner: CustomLoadingService,
    private scheduleService: ScheduleService,
    private actionService: ActionService,
    private scMessageService: SCMessageService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this.usersToInviteSubscription.unsubscribe();
    this.usersToSelectSubscription.unsubscribe();
    this.userToGroupSubscription.unsubscribe();
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
      ({ shiftId, userIds, filters, role, inviteAll, messaging }) => {
        const index = this.shifts.findIndex(v => v.id === shiftId);
        if (index > -1) {
          this.selectedTabIndex = 0; // Set staff tab active
          this.staffTab.inviteStaffs({ shiftId, userIds, filters, role, inviteAll, messaging });
        }
      });

    // add Users to Role
    this.usersToSelectSubscription = this.actionService.usersToSelect.subscribe(
      ({ shiftId, userIds, filters, role, selectAll, messaging }) => {
        const index = this.shifts.findIndex(v => v.id === shiftId);
        if (index > -1) {
          this.selectedTabIndex = 0; // Set staff tab active
          this.staffTab.selectStaffs({ shiftId, userIds, filters, role, selectAll, messaging });
        }
      });

    // Drag a user to Role
    this.userToGroupSubscription = this.actionService.userToGroup.subscribe(async ({ groupId, user }) => {
      if (groupId != this.group.id) { return; }
      try {
        const shifts = await this.scheduleService.getRolesForDraggingToGroup(user.id, groupId);
        const dialogRef = this.dialog.open(AddUserToGroupDialogComponent, {
          disableClose: false,
          panelClass: 'add-user-to-group-dialog',
          data: {
            group: this.group,
            shifts,
            user
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result) { return; }
          const { shiftId, roleName, roleId, action } = result;
          const userIds = [user.id];
          if (shiftId) { // for a shift
            const role = { id: roleId };
            switch (action) {
              case 'select':
                this.staffTab.selectStaffs({ shiftId, userIds, role, filters: null, selectAll: false, messaging: false });
                break;
              case 'apply':
                this.staffTab.applyStaffs({ shiftId, userIds, role });
                break;
              case 'standby':
                this.staffTab.standByStaffs({ shiftId, userIds, role });
                break;
              case 'invite':
                this.staffTab.inviteStaffs({ shiftId, userIds, role, filters: null, inviteAll: false, messaging: false });
                break;
              default:
                break;
            }
          } else { // for all shifts
            const roles: any[] = [];
            for (const shift of shifts) {
              for (const role of shift.roles) {
                if (role.rname.trim().toLowerCase() == roleName.trim().toLowerCase()) {
                  roles.push({ ...role, shiftId: shift.id });
                }
              }
            }
            if (roles.length === 0) { return; }
            switch (action) {
              case 'select':
                roles.forEach(role => this.staffTab.selectStaffs({ shiftId: role.shiftId, userIds, role, filters: null, selectAll: false, messaging: false }))
                break;
              case 'apply':
                roles.forEach(role => this.staffTab.applyStaffs({ shiftId: role.shiftId, userIds, role }))
                break;
              case 'standby':
                roles.forEach(role => this.staffTab.standByStaffs({ shiftId: role.shiftId, userIds, role }))
                break;
              case 'invite':
                roles.forEach(role => this.staffTab.inviteStaffs({ shiftId: role.shiftId, userIds, role, filters: null, inviteAll: false, messaging: false }))
                break;
              default:
                break;
            }
          }
        });
      } catch (e) {
        this.scMessageService.error(e);
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
      this.scMessageService.error(e);
    }
  }

  async toggleLive() {
    const live = this.group.live === 1 ? 0 : 1;
    try {
      this.group.live = live;
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async toggleFlag(flag) {
    const value = flag.set === 1 ? 0 : 1;
    try {
      flag.set = value;
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async toggleLock() {
    const locked = this.group.locked === 1 ? 0 : 1;
    try {
      this.group.locked = locked;
    } catch (e) {
      this.scMessageService.error(e);
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
    dialogRef.afterClosed().subscribe(() => { });
  }

  openExportDialog() {
    const dialogRef = this.dialog.open(AdminExportAsExcelDialogComponent, {
      panelClass: 'admin-shift-exports-as-excel-dialog',
      disableClose: false,
      data: {
        shiftIds: this.shifts.map(v => v.id),
        isGroup: true
      }
    });

    dialogRef.afterClosed().subscribe(() => { });
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

    dialogRef.afterClosed().subscribe(() => { });
  }

  selectedTabChange(event: MatTabChangeEvent) {
    switch (event.tab.textLabel) {
      case TAB.Activity:
        this.activityTab.show();
        break;

      default:
        this.activityTab.hide();
        break;
    }
  }

}
