import {
  Component, OnInit,
  ViewEncapsulation, Input,
  Output, EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatMenuTrigger } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../../../../schedule.service';
import { TabService } from '../../../../../../tab/tab.service';
import { UserService } from '../../../../../users/user.service';

import * as _ from 'lodash';
import { FuseConfirmDialogComponent } from '../../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import {
  STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
  STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY, STAFF_STATUS_CONFIRMED,
  STAFF_STATUS_CHECKED_IN, STAFF_STATUS_CHECKED_OUT, STAFF_STATUS_COMPLETED,
  STAFF_STATUS_INVOICED, STAFF_STATUS_PAID, STAFF_STATUS_NO_SHOW
} from '../../../../../../../constants/staff-status';
import { Tab } from '../../../../../../tab/tab';
import { TokenStorage } from '../../../../../../../shared/services/token-storage.service';
import { AuthenticationService } from '../../../../../../../shared/services/authentication.service';
import { TAB } from '../../../../../../../constants/tab';

enum Query {
  Counts = 'counts',
  Selected = 'selected',
  Standby = 'standby',
  Applicants = 'applicants',
  Invited = 'invited',
  Na = 'na'
}

@Component({
  selector: 'app-admin-shift-staff-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffApplicantsComponent implements OnInit {

  @Input() editable;
  @Input() roleId;
  @Input() shift;
  @Output() onChat = new EventEmitter();

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

  @Output() onStaffCountChanged = new EventEmitter();

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


  constructor(
    private spinner: CustomLoadingService,
    private scheduleService: ScheduleService,
    private tabService: TabService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private tokenStorage: TokenStorage,
    private authService: AuthenticationService,
    private router: Router
  ) { }

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

  changeStatus(staff, statusId) {
    let message = '';

    switch (statusId) {
      case STAFF_STATUS_SELECTED:
        message = 'Really change status to selected?';
        break;

      case STAFF_STATUS_APPLIED:
        message = 'Really change status to applied?';
        break;

      case STAFF_STATUS_STANDBY:
        message = 'Really change status to standby?';
        break;

      case STAFF_STATUS_HIDDEN_REJECTED:
        message = 'Really change status to hidden rejected?';
        break;

      case STAFF_STATUS_REJECTED:
        message = 'Really change status to rejected?';
        break;

      default:
        message = 'Really change status?';
        break;
    }

    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = message;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.updateRoleStaff(staff.id, { staff_status_id: statusId })
          .subscribe(res => {
            this.scheduleService.getRoleStaffs(this.roleId, Query.Applicants)
              .subscribe(res => {
                this.staffs = res;
              })
            this.updateStaffCount();
          });
      }
    });
  }

  assignStatus(staff, statusId = STAFF_STATUS_SELECTED) {
    let message = '';

    switch (statusId) {
      case STAFF_STATUS_SELECTED:
        message = 'Really change status to selected?';
        break;

      case STAFF_STATUS_STANDBY:
        message = 'Really change status to standby?';
        break;

      case STAFF_STATUS_HIDDEN_REJECTED:
        message = 'Really change status to hidden rejected?';
        break;

      case STAFF_STATUS_REJECTED:
        message = 'Really change status to rejected?';
        break;

      default:
        message = 'Really change status?';
        break;
    }

    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = message;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const params = {
          user_ids: [staff.user_id],
          staff_status_id: statusId
        };
        this.scheduleService.assignStaffsToRole(this.roleId, params)
          .subscribe(_ => {
            this.scheduleService.getRoleStaffs(this.roleId, Query.Applicants)
              .subscribe(res => {
                this.staffs = res;
              })
            this.updateStaffCount();
          });
      }
    });
  }

  private updateStaffCount() {
    this.onStaffCountChanged.next(true);
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

  openUser(staff, event: Event) {
    event.stopPropagation();
    this.userService.getUser(staff.user_id)
      .subscribe(res => {
        const user = res;
        const tab = new Tab(`${user.fname} ${user.lname}`, 'usersProfileTpl', `users/user/${user.id}`, user);
        this.tabService.openTab(tab);
      });
  }

  toggleTeamLeader(staff) {
    const team_leader = staff.team_leader === 1 ? 0 : 1;
    this.scheduleService.updateRoleStaff(staff.id, { team_leader })
      .subscribe(res => {
        staff.team_leader = team_leader;
      });
  }

  sendMessage(staff) {
    const tab = _.cloneDeep(TAB.USERS_NEW_MESSAGE_TAB);
    tab.data.recipients = [{ id: staff.user_id, text: staff.name }];
    this.tabService.openTab(tab);
  }

  chatMessage(staff) {
    this.onChat.next(staff);
  }

  ngOnInit() {
  }

  openContextMenu(evt: MouseEvent, contextMenu: MatMenuTrigger) {
    evt.preventDefault();
    contextMenu.openMenu();
  }

  getPerformanceClass(staff, type) {
    const rating = type === 'shift' ? staff.performance.rating : staff.performance.rating_client;
    let style: string;
    switch (true) {
      case rating > 0 && rating <= 1:
        style = 'red-fg';
        break;
      case rating > 1 && rating < 4:
        style = 'orange-fg';
        break;
      case rating >= 4:
        style = 'green-fg';
        break;
      default:
        style = '';
        break;
    }
    return style;
  }

}
