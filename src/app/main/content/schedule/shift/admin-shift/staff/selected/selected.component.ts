import {
  Component, OnInit,
  ViewEncapsulation, Input,
  Output, EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { OnRatingChangeEven } from 'angular-star-rating';

import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';
import { TabService } from '../../../../../../tab/tab.service';
import { UserService } from '../../../../../users/user.service';
import { ScheduleService } from '../../../../schedule.service';

import * as _ from 'lodash';
import * as moment from 'moment';

import { FuseConfirmDialogComponent } from '../../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../../../../tab/tab';
import {
  STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
  STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY} from '../../../../../../../constants/staff-status';
import { AddPayItemDialogComponent } from './add-pay-item-dialog/add-pay-item-dialog.component';
import { TokenStorage } from '../../../../../../../shared/services/token-storage.service';
import { AuthenticationService } from '../../../../../../../shared/services/authentication.service';
import { TAB } from '../../../../../../../constants/tab';
import { FuseConfirmYesNoDialogComponent } from '../../../../../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';
import { AdminShiftChangeCompanyDialogComponent } from './change-company-dialog/change-company-dialog.component';
import { ShiftAddUsersToPresentationDialogComponent } from '../dialogs/add-users-to-presentation-dialog/add-users-to-presentation-dialog.component';
import { SCMessageService } from '../../../../../../../shared/services/sc-message.service';

enum Query {
  Counts = 'counts',
  Selected = 'selected',
  Standby = 'standby',
  Applicants = 'applicants',
  Invited = 'invited',
  Na = 'na'
}

@Component({
  selector: 'app-admin-shift-staff-selected',
  templateUrl: './selected.component.html',
  styleUrls: ['./selected.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffSelectedComponent implements OnInit {

  @Input() editable;
  @Input() shift;
  @Input() roleId;
  @Input() currencies;
  @Output() onChat = new EventEmitter();

  currentUser: any;

  _staffs;
  @Input()
  get staffs() {
    return this._staffs;
  }

  @Output() staffsChange = new EventEmitter();
  set staffs(staffs) {
    this._staffs = staffs;
    this.staffsChange.emit(staffs);
  }

  @Input() showBillInfo = 0;

  @Output() onStaffCountChanged = new EventEmitter();
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  @ViewChild('payItemUploader') payItemUploader: ElementRef;
  selectedPayItem: any;
  settings: any;

  constructor(
    private spinner: CustomLoadingService,
    private tabService: TabService,
    private userService: UserService,
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private tokenStorage: TokenStorage,
    private authService: AuthenticationService,
    private scMessageService: SCMessageService,
    private router: Router
  ) {
    this.settings = tokenStorage.getSettings();
    this.currentUser = tokenStorage.getUser();
  }

  ngOnInit() {
    this.staffs.map(s => {
      s.pay_items_show === false;
      s.pay_items = s.pay_items ? s.pay_items : []
    });

    this.payItemUploader.nativeElement.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        this.uploadFile(files[0]);
      }
    }
  }

  get isClient() {
    return this.currentUser.lvl === 'client';
  }

  openUser(staff, event: Event) {
    if (this.isClient) { return; }
    event.stopPropagation();
    this.userService.getUser(staff.user_id)
      .subscribe(res => {
        const user = res;
        const tab = new Tab(`${user.fname} ${user.lname}`, 'usersProfileTpl', `users/user/${user.id}`, user);
        this.tabService.openTab(tab);
      });
  }

  getAvatar(value) {
    switch (value) {
      case 'male_tthumb.jpg':
      case 'female_tthumb.jpg':
      case 'nosex_tthumb.jpg':
        return `/assets/images/avatars/${value}`;
      default:
        return value;
    }
  }

  async loginAsUser(staff: any) {
    try {
      const res = await this.authService.loginAs(staff.user_id);
      this.tokenStorage.setSecondaryUser(res.user, res.permissions);
      this.tokenStorage.userSwitchListener.next(true);
      if (res.user.lvl.startsWith('registrant')) {
        const currentStep = this.authService.getCurrentStep();
        this.router.navigate(['/register', currentStep]);
      }
    } catch (e) {
      this.toastr.error((e.error ? e.error.message : e.message) || 'Something is wrong');
    }
  }

  addPayItem(staff) {
    const dialogRef: MatDialogRef<AddPayItemDialogComponent> =
      this.dialog.open(AddPayItemDialogComponent, {
        disableClose: false,
        panelClass: 'add-pay-item-dialog',
        data: {
          show_bill: this.showBillInfo,
          currencies: this.currencies
        }
      });

    dialogRef.afterClosed().subscribe(async (data) => {
      if (data !== false) {
        try {
          data = {
            ...data,
            role_staff_id: staff.id
          };
          const res = await this.scheduleService.addPayItem(data);
          const item = {
            ...res.data,
            type: 'staff'
          };
          staff.pay_items.push(item);
          this.recalcuatePayItemsTotal(staff);
        } catch (e) {
          this.toastr.error(e.error.message);
        }
      }
    });
  }

  removePayItem(staff, payItem) {
    if (payItem.type === 'role') {
      this.toastr.error('This is a role pay item and must be deleted from the role.');
      return;
    } else {
      const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
        disableClose: false
      });

      dialogRef.componentInstance.confirmTitle = 'Delete Pay Item';
      dialogRef.componentInstance.confirmMessage = 'Really delete?';
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          try {
            await this.scheduleService.deletePayItem(payItem.id);
            const index = staff.pay_items.findIndex(p => p.id === payItem.id);
            if (index > -1) {
              staff.pay_items.splice(index, 1);
            }
            this.recalcuatePayItemsTotal(staff);
          } catch (e) {
            this.toastr.error(e.error.message);
          }
        }
      });
    }
  }

  async uploadFile(file: File) {
    if (!this.selectedPayItem) return;
    try {
      this.spinner.show();
      let formData = new FormData();
      formData.append('receipt', file);
      const res = await this.scheduleService.updatePayItem(this.selectedPayItem.id, formData);
      this.selectedPayItem.file = res.data.file;
      this.selectedPayItem.file_id = res.data.file_id;
    } catch (e) {
      this.toastr.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  async toggleApproved(item: any) {
    try {
      if (item.approved) {
        item.approved = 0;
      } else {
        item.approved = 1;
      }
      await this.scheduleService.updatePayItem(item.id, { approved: item.approved });
    } catch (e) {
      this.toastr.error(e.error.message);
    }
  }

  togglePayItemsView(staff) {
    staff.pay_items_show = staff.pay_items_show ? false : true;
  }

  changeStatus(staff, statusId) {
    let message = "";

    switch (statusId) {
      case STAFF_STATUS_SELECTED:
        message = 'Really select this user?';
        break;

      case STAFF_STATUS_APPLIED:
        message = 'Really put this user on applied?';
        break;

      case STAFF_STATUS_STANDBY:
        message = 'Really put this user on standby?';
        break;

      case STAFF_STATUS_HIDDEN_REJECTED:
        message = 'Really hidden reject this user?';
        break;

      case STAFF_STATUS_REJECTED:
        message = 'Really reject this user?';
        break;

      default:
        message = 'Really update this user?';
        break;
    }

    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = message;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.updateRoleStaff(staff.id, { staff_status_id: statusId })
          .subscribe(() => {
            this.scheduleService.getRoleStaffs(this.roleId, Query.Selected)
              .subscribe(res => {
                this.staffs = res;
              });
            this.updateStaffCount();
          });
      }
    });
  }

  onTimeChanged(event, staff) {
    staff.start = event.start;
    staff.end = event.end;

    const start = moment(staff.start, 'hh:mm a');
    const end = moment(staff.end, 'hh:mm a');

    const duration = moment.duration(end.diff(start));
    staff.hours = _.round(duration.asHours(), 2);

    this.scheduleService.updateRoleStaff(staff.id, {
      staff_start: start.format('HH:mm'),
      staff_end: end.format('HH:mm')
    }).subscribe(() => {
    });
  }

  recalcuatePayItemsTotal(staff) {
    staff.pay_items_total = staff.pay_items.reduce((s, v) => s + v.units * v.unit_rate, 0);
  }

  onPayItemsChanged(event, staff) {
    const pay_rate = event.payRate;
    const pay_rate_type = event.payRateType;
    this.scheduleService.updateRoleStaff(staff.id, { pay_rate, pay_rate_type })
      .subscribe(() => {
        //this.toastr.success(res.message);
        staff.pay_rate = pay_rate;
        staff.pay_rate_type = pay_rate_type;
      });
  }

  onBillItemsChanged(event, staff) {
    const bill_rate = event.billRate;
    const bill_rate_type = event.billRateType;
    this.scheduleService.updateRoleStaff(staff.id, { bill_rate, bill_rate_type })
      .subscribe(() => {
        //this.toastr.success(res.message);
        staff.bill_rate = bill_rate;
        staff.bill_rate_type = bill_rate_type;
      });
  }

  private updateStaffCount() {
    this.onStaffCountChanged.next(true);
  }

  changeTimesLock(staff) {
    const times_locked = staff.times_locked === 1 ? 0 : 1;
    this.scheduleService.updateRoleStaff(staff.id, { times_locked })
      .subscribe(() => {
        staff.times_locked = times_locked;
      });
  }

  remove(staff) {
    let message = "Really remove this user?";

    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = message;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.removeRoleStaff(staff.id)
          .subscribe(() => {
            this.scheduleService.getRoleStaffs(this.roleId, Query.Selected)
              .subscribe(res => {
                this.staffs = res;
              });
            this.updateStaffCount();
          });
      }
    });
  }

  toggleTeamLeader(staff) {
    const team_leader = staff.team_leader === 1 ? 0 : 1;
    this.scheduleService.updateRoleStaff(staff.id, { team_leader })
      .subscribe(() => {
        staff.team_leader = team_leader;
      });
  }

  openChangeCompanyDialog(staff) {
    const dialogRef = this.dialog.open(AdminShiftChangeCompanyDialogComponent, {
      disableClose: false,
      panelClass: 'admin-shift-change-company-dialog',
      data: {
        staff
      }
    });
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result !== false) {
        staff.company = result;
      }
    });
  }

  async changeRate(event: OnRatingChangeEven, staff) {
    const score = event.rating;
    try {
      staff.rating = score;
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async resetRate(staff) {
    try {
      staff.rating = 0;
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async setLate(isLate: boolean, staff) {
    try {
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  sendMessage(staff) {
    const tab = _.cloneDeep(TAB.USERS_NEW_MESSAGE_TAB);
    tab.data.recipients = [{ id: staff.user_id, text: staff.name }];
    this.tabService.openTab(tab);
  }

  openAddUserToPresentationDialog(staff) {
    const dialogRef = this.dialog.open(ShiftAddUsersToPresentationDialogComponent, {
      disableClose: false,
      panelClass: 'shift-add-users-to-presentation-dialog',
      data: {
        user: staff
      }
    });
    dialogRef.afterClosed().subscribe(() => { });
  }

  chatMessage(staff) {
    this.onChat.next(staff);
  }

  openContextMenu(evt: MouseEvent, contextMenu: MatMenuTrigger) {
    evt.preventDefault();
    contextMenu.openMenu();
  }

  hasUnapprovedPayItem(staff) {
    return staff.pay_items.some(item => item.item_type === 'staff' && item.approved === null);
  }

}
