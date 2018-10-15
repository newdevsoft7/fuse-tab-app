import {
  Component, OnInit,
  ViewEncapsulation, Input,
  ViewChild, OnDestroy, Output, EventEmitter
} from '@angular/core';

import {
  FormBuilder, FormGroup,
  Validators
} from '@angular/forms';

import {
  MatDialog, MatDialogRef,
  MatTabChangeEvent
} from '@angular/material';


import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { Tab } from '../../../../../tab/tab';
import { TabService } from '../../../../../tab/tab.service';
import { ActionService } from '../../../../../../shared/services/action.service';
import { ScheduleService } from '../../../schedule.service';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import {
  STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
  STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY, STAFF_STATUS_INVITED
} from '../../../../../../constants/staff-status';
import { ShiftAddUsersToPresentationDialogComponent } from './dialogs/add-users-to-presentation-dialog/add-users-to-presentation-dialog.component';
import { ChatMessageDialogComponent } from './dialogs/chat-message-dialog/chat-message-dialog.component';
import { UsersChatService } from '../../../../users/chat/chat.service';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';
import { AddUserToShiftDialogComponent } from './dialogs/add-user-to-shift-dialog/add-user-to-shift-dialog.component';

export enum Section {
  Selected = 0,
  Standby = 1,
  Applicants = 2,
  Invited = 3,
  NA = 4
}

enum Query {
  Counts = 'counts',
  Selected = 'selected',
  Standby = 'standby',
  Applicants = 'applicants',
  Invited = 'invited',
  Na = 'na'
}

@Component({
  selector: 'app-admin-shift-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffComponent implements OnInit, OnDestroy {

  currentUser;
  roles: any[];

  public Section = Section;

  @Input() shift;
  @Output() onAddRole = new EventEmitter();
  @Input() currencies;

  @ViewChild('adminNoteInput') adminNoteInput;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  settings: any;
  canSavePost = false;

  adminNoteTypes: any = [];
  adminNotes = [];
  adminNoteForm: FormGroup;
  noteTemp: any; // Note template for update

  readonly noteTypes = [
    { value: 0, label: 'Default' }
  ];

  readonly noteClientVisibles = [
    { value: 0, label: 'Admin Only' },
    { value: 1, label: 'Admin & Client' }
  ];

  usersToRoleSubscription: Subscription;
  deleteRoleSubscrpition: Subscription;
  userToShiftScription: Subscription;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private tokenStorage: TokenStorage,
    private scheduleService: ScheduleService,
    private actionService: ActionService,
    private tabService: TabService,
    private spinner: CustomLoadingService,
    private chatService: UsersChatService,
    private scMessageService: SCMessageService    ) {
    this.currentUser = this.tokenStorage.getUser();
    this.settings = this.tokenStorage.getSettings();

    // Add Users to Role
    this.usersToRoleSubscription = this.actionService.usersToRole.subscribe(
      ({ userIds, role, section }) => {
        if (this.shift.id === role.shift_id) {
          const staffStatusId = mapSectionToStaffStatus(section);
          this.spinner.show();
          this.scheduleService.assignStaffsToRole(userIds, role.id, staffStatusId)
            .subscribe(() => {
              this.spinner.hide();
              this.refreshTabByRole(role, section);
              this.updateStaffsCount(role.id);
            }, () => {
              this.spinner.hide();
              this.updateStaffsCount(role.id);
              this.refreshTabByRole(role, section);
              this.toastr.error('Error!');
            });
        }
      });
    this.deleteRoleSubscrpition = this.actionService.deleteRole$.subscribe((roleIds: any[]) => {
      this.roles = this.roles.filter(r => roleIds.indexOf(r.id) < 0);
    });

    this.userToShiftScription = this.actionService.userToShift.subscribe(async ({ shiftId, user }) => {
      if (shiftId == this.shift.id) {
        try {
          const roles = await this.scheduleService.getRolesForDraggingToShift(user.id, shiftId);
          if (roles.length === 0) { return; }
          const dialogRef = this.dialog.open(AddUserToShiftDialogComponent, {
            disableClose: false,
            panelClass: 'add-user-to-shift-dialog',
            data: {
              shift: this.shift,
              roles,
              user
            }
          });
          dialogRef.afterClosed().subscribe(async result => {
            if (!result) {
              return;
            }
            const { role, action } = result;
            switch (action) {
              case 'select':
                this.selectStaffs({ userIds: [user.id], role });
                break;
              case 'apply':
                this.applyStaffs({ userIds: [user.id], role });
                break;
              case 'standby':
                this.standByStaffs({ userIds: [user.id], role });
                break;
              case 'invite':
                this.inviteStaffs({ userIds: [user.id], role, inviteAll: false });
                break;
              default:
                break;
            }
          });
        } catch (e) {
          this.scMessageService.error(e);
        }
      }
    });
  }

  get isClient() {
    return this.currentUser.lvl === 'client';
  }

  ngOnInit() {
    this.adminNoteTypes = this.settings.admin_note_types || [];
    const type_id = this.adminNoteTypes.length > 0 ? this.adminNoteTypes[0].id : '';

    this.adminNoteForm = this.formBuilder.group({
      type_id: [type_id],
      client_visible: [0],
      note: ['', Validators.required]
    });

    this.adminNoteForm.valueChanges.subscribe(() => {
      this.onAdminNoteFormValuesChanged();
    });

    if (!this.isClient) {
      // Get shift admin notes
      this.scheduleService.getShiftAdminNotes(this.shift.id)
        .subscribe(res => {
          this.adminNotes = res;
        });
    }


    this.roles = this.shift.shift_roles.map((role, index) => {

      // Get selected from shift role staff
      const selected = role.role_staff.filter(() => {
        return true;
      });
      return {
        ...role,
        index,
        selected,
        section: Section.Selected,
        shiftTitle: this.shift.title,
      };
    });
  }

  ngOnDestroy() {
    this.usersToRoleSubscription.unsubscribe();
    this.deleteRoleSubscrpition.unsubscribe();
    this.userToShiftScription.unsubscribe();
  }

  async onEditRole(role) {
    try {
      this.spinner.show();
      const data = await this.scheduleService.getShiftRole(role.id);
      this.spinner.hide();
      const url = `shift/role/${role.id}/role-edit`;
      const roleTab = new Tab(
        'Edit Role',
        'shiftRoleEditTpl',
        url,
        {
          url,
          role: { ...data, shift_title: this.shift.title }
        });
      this.tabService.closeTab(url);
      this.tabService.openTab(roleTab);
    } catch (e) {
      this.spinner.hide();
      this.toastr.error(e.error.message || 'Something is wrong!');
    }
  }

  onSelectedTabChange(role, event: MatTabChangeEvent) {
    const selectedTab = event.index;

    this.refreshTabByRole(role, selectedTab);
  }

  inviteStaffs({ userIds, filters, role, inviteAll }) {
    const body: any = {};
    if (inviteAll) {
      body.filters = filters;
    } else {
      body.user_ids = userIds;
    }
    this.spinner.show();
    this.scheduleService.inviteStaffsToRole(role.id, body).subscribe(
      () => {
        this.spinner.hide();
        this.refreshTabByRole(role, Section.Invited);
        this.updateStaffsCount(role.id);
        const index = this.roles.findIndex(v => v.id === role.id);
        this.roles[index].section = Section.Invited;
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
  }

  selectStaffs({ userIds, role }) {
    const body: any = {};
    body.user_ids = userIds;
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(userIds, role.id, STAFF_STATUS_SELECTED).subscribe(
      () => {
        this.spinner.hide();
        this.refreshTabByRole(role, Section.Selected);
        this.updateStaffsCount(role.id);
        const index = this.roles.findIndex(v => v.id === role.id);
        this.roles[index].section = Section.Selected;
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
  }

  standByStaffs({ userIds, role }) {
    const body: any = {};
    body.user_ids = userIds;
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(userIds, role.id, STAFF_STATUS_STANDBY).subscribe(
      () => {
        this.spinner.hide();
        this.refreshTabByRole(role, Section.Standby);
        this.updateStaffsCount(role.id);
        const index = this.roles.findIndex(v => v.id === role.id);
        this.roles[index].section = Section.Standby;
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
  }

  applyStaffs({ userIds, role }) {
    const body: any = {};
    body.user_ids = userIds;
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(userIds, role.id, STAFF_STATUS_APPLIED).subscribe(
      () => {
        this.spinner.hide();
        this.refreshTabByRole(role, Section.Applicants);
        this.updateStaffsCount(role.id);
        const index = this.roles.findIndex(v => v.id === role.id);
        this.roles[index].section = Section.Applicants;
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
  }

  moveup(role) {
    const index = role.index;
    if (index === 0) { return; }
    this.scheduleService.UpdateRoleDisplayOrder(role.id, 'up').subscribe(() => {
      this.roles[index].index = index - 1;
      this.roles[index - 1].index = index;
      this.roles = this.roles.sort((a, b) => a.index - b.index);
    });
  }

  movedown(role) {
    const index = role.index;
    if (index === this.roles.length - 1) { return; }
    this.scheduleService.UpdateRoleDisplayOrder(role.id, 'down').subscribe(() => {
      this.roles[index].index = index + 1;
      this.roles[index + 1].index = index;
      this.roles = this.roles.sort((a, b) => a.index - b.index);
    });
  }

  private refreshTabByRole(role, selectedTab: Section) {
    switch (selectedTab) {
      case Section.Selected:
        this.scheduleService.getRoleStaffs(role.id, Query.Selected)
          .subscribe(res => {
            const index = this.roles.findIndex(v => v.id === role.id);
            this.roles[index].selected = res;
          }, err => {
            this.toastr.error(err.error.message);
          });
        break;

      case Section.Standby:
        this.scheduleService.getRoleStaffs(role.id, Query.Standby)
          .subscribe(res => {
            const index = this.roles.findIndex(v => v.id === role.id);
            this.roles[index].standby = res;
          }, err => {
            this.toastr.error(err.error.message);
          });
        break;

      case Section.Applicants:
        this.scheduleService.getRoleStaffs(role.id, Query.Applicants)
          .subscribe(res => {
            const index = this.roles.findIndex(v => v.id === role.id);
            this.roles[index].applicants = res;
          }, err => {
            this.toastr.error(err.error.message);
          });
        break;

      case Section.Invited:
        this.scheduleService.getRoleStaffs(role.id, Query.Invited)
          .subscribe(res => {
            const index = this.roles.findIndex(v => v.id === role.id);
            this.roles[index].invited = res;
          }, err => {
            this.toastr.error(err.error.message);
          });
        break;

      case Section.NA:
        this.scheduleService.getRoleStaffs(role.id, Query.Na)
          .subscribe(res => {
            const index = this.roles.findIndex(v => v.id === role.id);
            this.roles[index].na = res;
          }, err => {
            this.toastr.error(err.error.message);
          });
        break;

      default:
        break;
    }
  }

  onAddStaffToRole(role) {
    // TODO
    const roles = this.shift.shift_roles.map(v => {
      return {
        id: v.id,
        name: v.rname
      };
    });
    const data = {
      roles,
      shiftId: this.shift.id,
      select: true,
      tab: `admin/shift/${this.shift.id}`,
      filters: [],
      title: this.shift.title,
      selectedRoleId: role.id
    };

    this.tabService.closeTab('users');
    const tab = new Tab('Users', 'usersTpl', 'users', data);

    this.tabService.openTab(tab);
  }

  onInviteStaffToRole(role) {
    const roles = this.shift.shift_roles.map(v => {
      return {
        id: v.id,
        name: v.rname
      };
    });
    const data = {
      roles,
      shiftId: this.shift.id,
      invite: true,
      tab: `admin/shift/${this.shift.id}`,
      filters: [],
      title: this.shift.title,
      selectedRoleId: role.id
    };

    this.tabService.closeTab('users');
    const tab = new Tab('Users', 'usersTpl', 'users', data);

    this.tabService.openTab(tab);
  }

  updateStaffsCount(roleId) {
    // TODO - Update Staffs count of a role
    this.scheduleService.getRoleStaffsCounts(roleId)
      .subscribe(res => {
        const role = this.roles.find(r => r.id === roleId);
        if (role) {
          role['num_selected'] = res.num_selected;
          role['num_standby'] = res.num_standby;
          role['num_applicants'] = res.num_applicants;
          role['num_na'] = res.num_na;
          role['num_invited'] = res.num_invited;
        }
      });
  }

  changeStatus(role, statusId) {
    const section = role.section;
    let staffs = [];
    switch (section) {
      case Section.Selected:
        staffs = role.selected;
        break;

      case Section.Standby:
        staffs = role.standby;
        break;

      case Section.Applicants:
        staffs = role.applicants;
        break;

      case Section.Invited:
        staffs = role.invited;
        break;

      default:
        staffs = role.na;
        break;
    }

    const count = staffs.length;
    if (count === 0) { return false; }

    const applicantsMsg = count > 1 ? 'these applicants' : 'this applicant';
    let message = '';
    switch (statusId) {
      case STAFF_STATUS_SELECTED:
        message = `Really select ${applicantsMsg}?`;
        break;

      case STAFF_STATUS_APPLIED:
        message = `Really put ${applicantsMsg} on applied?`;
        break;

      case STAFF_STATUS_STANDBY:
        message = `Really put ${applicantsMsg} on standby?`;
        break;

      case STAFF_STATUS_HIDDEN_REJECTED:
        message = `Really hidden reject ${applicantsMsg}?`;
        break;

      case STAFF_STATUS_REJECTED:
        message = `Really reject ${applicantsMsg}?`;
        break;

      default:
        message = `Really update ${applicantsMsg}?`;
        break;
    }

    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = message;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.updateRoleStaffs(staffs.map(v => v.id), { staff_status_id: statusId })
          .subscribe(() => {
            //this.toastr.success(`Status${res.length > 1 ? 'es' : ''} updated.`);
            this.updateStaffsBySection(role);
          }, () => {
            this.updateStaffsBySection(role);
          });
      }
    });
  }

  private updateStaffsBySection(role) {
    let query = '';
    switch (role.section) {
      case Section.Selected:
        query = Query.Selected;
        break;

      case Section.Standby:
        query = Query.Standby;
        break;

      case Section.Applicants:
        query = Query.Applicants;
        break;

      case Section.Invited:
        query = Query.Invited;
        break;

      default:
        query = Query.Na;
        break;
    }

    this.scheduleService.getRoleStaffs(role.id, query)
      .subscribe(res => {
        role[query] = res;
      });
    this.updateStaffsCount(role.id);
  }

  getNoteClientVisible(noteClientVisible) {
    const visible = this.noteClientVisibles.find(v => v.value === noteClientVisible);
    return visible ? visible.label : '';
  }

  onAdminNoteFormValuesChanged() {
    const note = this.adminNoteForm.getRawValue().note;
    if (note.length > 0) {
      this.canSavePost = true;
    } else {
      this.canSavePost = false;
    }
  }

  onPostAdminNote() {
    const form = this.adminNoteForm.getRawValue();
    let data: any = { note: form.note, type_id: form.type_id };
    if (this.settings.client_enable === '1') { data.client_visible = form.client_visible; }
    this.canSavePost = false;
    this.scheduleService.createShiftAdminNote(this.shift.id, data)
      .subscribe(res => {
        const note = res.data;
        note.creator_ppic_a = this.currentUser.ppic_a;
        note.creator_name = `${this.currentUser.fname} ${this.currentUser.lname}`;

        if (this.adminNoteTypes.length > 0 && note.type_id != null) {
          const noteType = this.adminNoteTypes.find(v => v.id === note.type_id);
          note.color = noteType.color;
          note.tname = noteType.tname;
        }

        this.adminNotes.unshift(note);

        this.adminNoteInput.nativeElement.value = '';
        this.adminNoteInput.nativeElement.focus();
      }, err => {
        this.scMessageService.error(err);
      });
  }

  onDeleteAdminNote(note) {
    const index = this.adminNotes.findIndex(v => v.id === note.id);
    this.scheduleService.deleteShiftAdminNote(note.id)
      .subscribe(() => {
        this.adminNotes.splice(index, 1);
      }, err => {
        this.scMessageService.error(err);
      });
  }

  onEditAdminNote(note) {
    note.editMode = true;
    this.noteTemp = _.cloneDeep(note);
  }

  onCancelEditAdminNote(note) {
    note.editMode = false;
  }

  onUpdateAdminNote(note) {


    // Update note
    this.scheduleService.updateAdminNote(
      note.id,
      {
        note: this.noteTemp.note,
        type_id: this.noteTemp.type_id === null ? '' : this.noteTemp.type_id,
        client_visible: this.noteTemp.client_visible
      }
    ).subscribe(res => {
      const data = res.data;
      note.type_id = this.noteTemp.type_id;
      note.client_visible = this.noteTemp.client_visible;
      note.note = this.noteTemp.note;
      note.updated_at = data.updated_at;

      if (this.adminNoteTypes.length > 0 && note.type_id != null) {
        const noteType = this.adminNoteTypes.find(v => v.id === note.type_id);
        note.color = noteType.color;
        note.tname = noteType.tname;
      }
    });
    note.editMode = false;

  }

  onChat(staff) {
    const dialogRef = this.dialog.open(ChatMessageDialogComponent, {
      disableClose: false,
      panelClass: 'chat-message-dialog'
    });
    dialogRef.afterClosed().subscribe(async(content) => {
      if (content) {
        try {
          await this.chatService.sendMessage({
            content,
            recipient_id: staff.user_id,
            shift_id: this.shift.id
          });
        } catch (e) {
          this.scMessageService.error(e);
        }
      }
    });
  }

  addRole() {
    this.onAddRole.next(true);
  }

  openAddUserToPresentationDialog(role) {
    const dialogRef = this.dialog.open(ShiftAddUsersToPresentationDialogComponent, {
      disableClose: false,
      panelClass: 'shift-add-users-to-presentation-dialog',
      data: {
        role: role
      }
    });
    dialogRef.afterClosed().subscribe(() => { });
  }

}

function mapSectionToStaffStatus(section) {
  switch (section) {
    case Section.Selected:
      return STAFF_STATUS_SELECTED;

    case Section.Standby:
      return STAFF_STATUS_STANDBY;

    case Section.Applicants:
      return STAFF_STATUS_APPLIED;

    case Section.Invited:
      return STAFF_STATUS_INVITED;

    case Section.NA:
      return STAFF_STATUS_REJECTED;

    default:
      return '';
  }
}
