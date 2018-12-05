import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { AdminShiftMapComponent } from './map/map.component';
import { AdminShiftStaffComponent } from './staff/staff.component';
import { TabService } from '../../../../tab/tab.service';
import { Tab } from '../../../../tab/tab';
import { ActionService } from '../../../../../shared/services/action.service';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ShiftListEmailDialogComponent } from '../../shift-list/admin-shift-list/email-dialog/email-dialog.component';
import { AdminExportAsPdfDialogComponent } from '../../shifts-export/admin/export-as-pdf-dialog/export-as-pdf-dialog.component';
import { AdminExportAsExcelDialogComponent } from '../../shifts-export/admin/export-as-excel-dialog/export-as-excel-dialog.component';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';
import { NewMessageDialogComponent } from '../../../users/profile/dialogs/new-message-dialog/new-message-dialog.component';
import { UsersChatService } from '../../../users/chat/chat.service';
import { AdminShiftActivityComponent } from './activity/activity.component';
import { FilterService } from '@shared/services/filter.service';

export enum TAB {
  Staff = 'Staff',
  Bill = 'Bill',
  Reports = 'Reports & Uploads',
  Attachements = 'Attachments',
  Map = 'Map',
  Activity = 'Activity'
}

@Component({
  selector: 'app-admin-shift',
  templateUrl: './admin-shift.component.html',
  styleUrls: ['./admin-shift.component.scss']
})
export class AdminShiftComponent implements OnInit, OnDestroy {

  @Input() data;
  @ViewChild('staffTab') staffTab: AdminShiftStaffComponent;
  @ViewChild('mapTab') mapTab: AdminShiftMapComponent;
  @ViewChild('activityTab') activityTab: AdminShiftActivityComponent;

  showMoreBtn = true;

  usersToInviteSubscription: Subscription;
  usersToSelectSubscription: Subscription;
  selectedTabIndex: number = 0; // Set staff tab as initial tab

  shiftData: any = {}; // For edit tracking & work areas
  currencies: any[] = [];

  get id() {
    return this.data.id;
  }

  get url() {
    return this.data.url;
  }

  currentUser: any;
  shift: any;
  timezones = [];
  notes; // For Shift notes tab
  settings: any = {};
  clients: any[] = [];

  constructor(
    private tokenStorage: TokenStorage,
    private toastr: ToastrService,
    private userService: UserService,
    private scheduleService: ScheduleService,
    private tabService: TabService,
    private actionService: ActionService,
    private scMessageService: SCMessageService,
    private chatService: UsersChatService,
    private filterService: FilterService,
    private dialog: MatDialog
  ) {
    // Invite Users to Role
    this.usersToInviteSubscription = this.actionService.usersToInvite.subscribe(
      ({ shiftId, userIds, filters, role, inviteAll , messaging }) => {
        if (this.shift.id === shiftId) {
          this.selectedTabIndex = 0; // Set staff tab active
          this.staffTab.inviteStaffs({ userIds, filters, role, inviteAll, messaging });
        }
      });
    // add Users to Role
    this.usersToSelectSubscription = this.actionService.usersToSelect.subscribe(
      ({ shiftId, userIds, filters, role, selectAll, messaging }) => {
        if (this.shift.id === shiftId) {
          this.selectedTabIndex = 0; // Set staff tab active
          this.staffTab.selectStaffs({ userIds, filters, role, selectAll, messaging });
        }
      });
  }

  ngOnInit() {
    this.currentUser = this.tokenStorage.getUser();
    this.settings = this.tokenStorage.getSettings();
    this.fetch();

    this.scheduleService.getTimezones()
      .subscribe(res => {
        Object.keys(res).forEach(key => {
          this.timezones.push({ value: key, label: res[key] });
        });
      });

    this.userService.getCurrencies().then(currencies => this.currencies = currencies);


    if (!this.isClient) {
      // Get Clients
      this.filterService.getClientFilter('').then(clients => this.clients = clients);

      // Get Tracking Categories & Options
      this.scheduleService.getShiftsData().subscribe(res => {
        this.shiftData = res;
      });

    }


  }

  ngOnDestroy() {
    this.usersToInviteSubscription.unsubscribe();
    this.usersToSelectSubscription.unsubscribe();
  }

  deleteShift() {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = 'Are you sure?';
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result) {
        try {
          await this.scheduleService.deleteShift(this.shift.id);
          this.filterService.clean(this.filterService.type.shifts);
          this.tabService.closeTab(this.url);
        } catch (e) {
          this.scMessageService.error(e);
        }
      }
    });
  }

  invite() {
    const roles = this.shift.shift_roles.map(v => {
      return {
        id: v.id,
        name: v.rname
      };
    });
    if (roles.length === 0) {
      this.toastr.error('There are no roles in the shift. Please add a role first.');
      return;
    }
    const data = {
      roles,
      shiftId: this.id,
      invite: true,
      tab: `admin/shift/${this.shift.id}`,
      filters: [],
      title: this.shift.title
    };

    this.tabService.closeTab('users');
    const tab = new Tab('Users', 'usersTpl', 'users', data);

    this.tabService.openTab(tab);
  }

  toggleMoreBtn() {
    this.showMoreBtn = !this.showMoreBtn;
  }

  selectedTabChange(event: MatTabChangeEvent) {
    switch (event.tab.textLabel) {
      case TAB.Map:
        this.mapTab.refreshMap();
        this.activityTab.hide();
        break;

      case TAB.Activity:
        this.activityTab.show();
        break;

      default:
        this.activityTab.hide();
        break;
    }
  }

  toggleFlag(flag) {
    const value = flag.set === 1 ? 0 : 1;
    this.scheduleService.setShiftFlag(this.shift.id, flag.id, value)
      .subscribe(() => {
        flag.set = value;
      });
  }

  toggleLive() {
    const live = this.shift.live === 1 ? 0 : 1;
    this.scheduleService.publishShift(this.shift.id, live)
      .subscribe(() => {
        this.shift.live = live;
      });
  }

  toggleLock() {
    const lock = this.shift.locked === 1 ? 0 : 1;
    this.scheduleService.lockShift(this.shift.id, lock)
      .subscribe(() => {
        this.shift.locked = lock;
      });
  }

  onAddressChanged(address) {
    this.shift.address = address;
  }

  onContactChanged(contact) {
    this.shift.contact = contact;
  }

  onGenericLocationChanged(genericLocation) {
    this.shift.generic_location = genericLocation;
  }

  onGenericTitleChanged(genericTitle) {
    this.shift.generic_title = genericTitle;
  }

  onLocationChanged(location: any) {
    if (location) {
      this.shift.location_id = location.id;
      this.shift.location = location.lname;
    } else {
      this.shift.location_id = null;
      this.shift.location = null;
    }
  }

  onTitleChanged(title) {
    this.shift.title = title;
  }

  onPeriodChanged({ start, end, timezone }) {
    this.shift.shift_start = start;
    this.shift.shift_end = end;
    this.shift.timezone = timezone;
  }

  onManagersChanged(managers: any[]) {
    this.shift.managers = managers;
  }

  addRole() {
    const url = `shift/${this.shift.id}/role-edit`;
    const shift = this.shift;
    const tab = new Tab(
      `Add Role (1 shift)`,
      'shiftRoleEditTpl',
      url,
      { shift, url });
    this.tabService.closeTab(url);
    this.tabService.openTab(tab);
  }

  message(type) {
    const dialogRef = this.dialog.open(ShiftListEmailDialogComponent, {
      disableClose: false,
      panelClass: 'admin-shift-email-dialog',
      data: {
        shiftIds: [this.shift.id],
        type
      }
    });
    dialogRef.afterClosed().subscribe(() => { });
  }

  get isClient() {
    return this.currentUser.lvl === 'client';
  }

  private async fetch() {
    try {
      this.shift = await this.scheduleService.getShift(this.id);
      this.notes = _.clone(this.shift.notes);
    } catch (e) {
      this.toastr.error(e.message || 'Something is wrong while fetching events.');
    }
  }

  openExportDialog() {
    const dialogRef = this.dialog.open(AdminExportAsExcelDialogComponent, {
      panelClass: 'admin-shift-exports-as-excel-dialog',
      disableClose: false,
      data: { shiftIds: [this.shift.id] }
    });

    dialogRef.afterClosed().subscribe(() => { });
  }

  openOverviewDialog() {
    const dialogRef = this.dialog.open(AdminExportAsPdfDialogComponent, {
      panelClass: 'admin-shift-exports-as-pdf-dialog',
      disableClose: false,
      data: { shiftIds: [this.shift.id] }
    });

    dialogRef.afterClosed().subscribe(() => { });
  }

  openChat() {
    let dialogRef: any;

    switch (true) {
      case this.shift.thread_id == 0:
        dialogRef = this.dialog.open(NewMessageDialogComponent, {
          panelClass: 'new-message-dialog'
        });
        dialogRef.afterClosed().subscribe(async message => {
          if (!message) {
            return;
          }
          try {
            const { thread_id } = await this.chatService.sendMessage({
              shift_id: this.shift.id,
              content: message
            });
            this.openChatTab(thread_id);
          } catch (e) {
            this.scMessageService.error(e);
          }
        });
        break;
      case this.shift.thread_id > 0:
        this.openChatTab(this.shift.thread_id);
        break;
      default:
        break;
    }
  }

  openChatTab(threadId) {
    const tab = new Tab('Chat', 'usersChatTpl', 'users/chat', { threadId });
    this.tabService.openTab(tab);
  }

}
