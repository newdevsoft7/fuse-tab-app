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
import {TAB} from '../../../../../../constants/tab';
import { StaffShiftPayItemDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/pay-item-dialog/pay-item-dialog.component';
import { StaffShiftApplyDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/apply-dialog/apply-dialog.component';
import { StaffShiftConfirmDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/confirm-dialog/confirm-dialog.component';
import { StaffShiftReplaceDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/replace-dialog/replace-dialog.component';
import { StaffShiftCheckInOutDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/check-in-out-dialog/check-in-out-dialog.component';
import { StaffShiftCompleteDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/complete-dialog/complete-dialog.component';
import { StaffShiftQuizDialogComponent } from '@main/content/schedule/shift/staff-shift/info/dialogs/quiz-dialog/quiz-dialog.component';
import { TabComponent } from '@main/tab/tab/tab.component';
import { FuseInfoDialogComponent } from '@core/components/info-dialog/info-dialog.component';
import { ConnectorService } from '@shared/services/connector.service';

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

enum Status {
  STAFF_STATUS_INVITED = 1,
  STAFF_STATUS_APPLIED = 2,
  STAFF_STATUS_STANDBY = 3,
  STAFF_STATUS_SELECTED = 4,
  STAFF_STATUS_CONFIRMED = 5,
  STAFF_STATUS_CHECKED_IN = 7,
  STAFF_STATUS_NO_SHOW = 8,
  STAFF_STATUS_CHECKED_OUT = 10,
  STAFF_STATUS_COMPLETED = 13,
  STAFF_STATUS_INVOICED = 14,
  STAFF_STATUS_PAID = 15
}

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
  @Output() shiftChanged = new EventEmitter();
  @Input() currencies;

  @ViewChild('adminNoteInput') adminNoteInput;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  settings: any;
  canSavePost = false;

  adminNoteTypes: any = [];
  adminNotes = [];
  adminNoteForm: FormGroup;
  noteTemp: any; // Note template for update
  selectedTab: number = 0;

  readonly noteTypes = [
    { value: 0, label: 'Default' }
  ];

  readonly noteClientVisibles = [
    { value: 0, label: 'Admin Only' },
    { value: 1, label: 'Admin & Client' }
  ];

  readonly Action = Action;

  deleteRoleSubscrpition: Subscription;
  userToShiftScription: Subscription;
  quizEventSubscription: Subscription;

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
    private scMessageService: SCMessageService,
    private connectorService: ConnectorService,
  ) {
    this.currentUser = this.tokenStorage.getUser();
    this.settings = this.tokenStorage.getSettings();

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
                this.selectStaffs({ userIds: [user.id], role, selectAll: false, filters: null, messaging: false });
                break;
              case 'apply':
                this.applyStaffs({ userIds: [user.id], role });
                break;
              case 'standby':
                this.standByStaffs({ userIds: [user.id], role });
                break;
              case 'invite':
                this.inviteStaffs({ userIds: [user.id], role, inviteAll: false, filters: null, messaging: false });
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

    this.quizEventSubscription = this.connectorService.currentQuizTab$.subscribe((tab: TabComponent) => {
      if (!tab) { return; }
      const id = tab.data.other_id;
      if (tab && tab.url === `staff-shift/reports/${id}`) {
        this.tabService.closeTab(tab.url);
        this.shiftChanged.next(true);
      } else if (tab && tab.url === `staff-shift/quiz/${id}`) {
        const role = tab.data.role;
        const index = this.shift.shift_roles.findIndex(v => v.id === role.id);
        if (index > -1) {
          const score = tab.data.score; // assume that quizconnect returns score
          this.openScoreDialog(score);
          const quiz = this.shift.shift_roles[index].quizs.find(v => v.other_id === id);
          if (quiz) {
            quiz.completed_score = score;
            if (quiz.required_score > 0) {
              quiz.required = score >= quiz.required_score ? 0 : 1;
            } else {
              quiz.required = 0;
            }
          }
        }
        this.tabService.closeTab(tab.url);
      }
    });
  }

  ngOnDestroy() {
    this.deleteRoleSubscrpition.unsubscribe();
    this.userToShiftScription.unsubscribe();
    this.quizEventSubscription.unsubscribe();
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

  async onResetRoleTimes(role){
    for (const staff of role.role_staff) {
      staff.start = role.start || this.shift.start;
      staff.end = role.end || this.shift.end;
    }
    await this.scheduleService.updateMultipleRoles({
      ids: [role.id],
      reset_times: 1
    }).toPromise();
  }

  onSelectedTabChange(role, event: MatTabChangeEvent) {
    this.selectedTab = event.index;

    this.refreshTabByRole(role, this.selectedTab);
  }

  inviteStaffs({ userIds, filters, role, inviteAll, messaging }) {
    const params: any = {
      staff_status_id: STAFF_STATUS_INVITED,
      edit_message: messaging
    };
    if (inviteAll) {
      params.filters = filters;
    } else {
      params.user_ids = userIds;
    }
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(role.id, params).subscribe(
      ({ to, message_template }) => {
        this.spinner.hide();
        this.refreshTabByRole(role, Section.Invited);
        this.updateStaffsCount(role.id);
        const index = this.roles.findIndex(v => v.id === role.id);
        this.roles[index].section = Section.Invited;
        if (messaging) { this.openMessageTab(to, message_template, role.id); }
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
  }

  selectStaffs({ userIds, filters, role, selectAll, messaging }) {
    const params: any = {
      staff_status_id: STAFF_STATUS_SELECTED,
      edit_message: messaging
    };
    if (selectAll) {
      params.filters = filters;
    } else {
      params.user_ids = userIds;
    }
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(role.id, params).subscribe(
      ({ to, message_template }) => {
        this.spinner.hide();
        this.refreshTabByRole(role, Section.Selected);
        this.updateStaffsCount(role.id);
        const index = this.roles.findIndex(v => v.id === role.id);
        this.roles[index].section = Section.Selected;
        if (messaging) { this.openMessageTab(to, message_template, role.id); }
      },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.message);
      });
  }

  standByStaffs({ userIds, role }) {
    const params = {
      staff_status_id: STAFF_STATUS_STANDBY,
      user_ids: userIds
    };
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(role.id, params).subscribe(
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
    const params = {
      staff_status_id: STAFF_STATUS_APPLIED,
      user_ids: userIds
    };
    this.spinner.show();
    this.scheduleService.assignStaffsToRole(role.id, params).subscribe(
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
    const count = role.role_staff.length;
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

    this.confirmDialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.scheduleService.updateMultipleRoles({
          ids: [role.id],
          staff_status_id: Status[statusId]
        }).toPromise();
        this.refreshTabByRole(role, this.selectedTab);
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

  openMessageTab(recipients, messageTemplate, roleId) {
    const tab = _.cloneDeep(TAB.USERS_NEW_MESSAGE_TAB);
    tab.data.recipients = recipients;
    tab.data.template =  messageTemplate;
    tab.data.shiftRoleId = roleId;
    this.tabService.openTab(tab);
  }

  openQuizDialog(role, quizs) {
    const dialogRef = this.dialog.open(StaffShiftQuizDialogComponent, {
      disableClose: false,
      panelClass: 'staff-shift-quiz-dialog',
      data: {
        role,
        quizs
      }
    });
    dialogRef.afterClosed().subscribe(_ => { });
  }

  doAction(action, role) {
    let dialogRef;
    let quizs;
    let tab: Tab;

    switch (action) {
      case Action.apply:
        quizs = role.quizs.filter(v => v.required === 1);
        if (role.show_quizs === 1 && quizs.length > 0) {
          this.openQuizDialog(role, quizs);
        } else {
          dialogRef = this.dialog.open(StaffShiftApplyDialogComponent, {
            panelClass: 'staff-shift-apply-dialog',
            data: {
              forms: this.shift.forms_apply,
              shift_id: this.shift.id
            }
          });
          dialogRef.afterClosed().subscribe(reason => {
            if (reason === false) { return; }
            this.scheduleService.applyShiftRole(role.id, reason)
              .subscribe(res => {
                role.message = res.role_message;
                role.actions = [...res.actions];
                role.role_staff_id = res.id;
              }, err => this.scMessageService.error(err));
          });
        }
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
                role.message = res.role_message;
                role.actions = [...res.actions];
                delete role.role_staff_id;
              }, err => this.scMessageService.error(err));
          }
        });
        break;

      case Action.not_available:
        this.scheduleService.notAvailableShiftRole(role.id).subscribe(res => {
          role.message = res.role_message;
          role.actions = [...res.actions];
          role.role_staff_id = res.id;
        }, err => this.scMessageService.error(err));
        break;

      case Action.confirm:
        quizs = role.quizs.filter(v => v.required === 1);
        if (role.show_quizs === 1 && quizs.length > 0) {
          this.openQuizDialog(role, quizs);
        } else {
          dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
            data: {
              title: 'Really confirm this role?',
              heading: this.settings.shift_msg_confirmation,
              forms: this.shift.forms_confirm,
              surveys: role.surveys,
              showSurveys: role.show_surveys,
              shift_id: this.shift.id
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              const roleStaffId = role.role_staff_id;
              this.scheduleService.confirmStaffSelection(roleStaffId)
                .subscribe(res => {
                  role.message = res.role_message;
                  role.actions = [...res.actions];
                }, err => this.scMessageService.error(err));
            }
          });
        }
        break;

      case Action.replace:
        dialogRef = this.dialog.open(StaffShiftReplaceDialogComponent, {
          panelClass: 'staff-shift-replace-dialog'
        });
        dialogRef.afterClosed().subscribe(reason => {
          if (reason) {
            const roleStaffId = role.role_staff_id;
            this.scheduleService.replaceShiftRole(roleStaffId, reason)
              .subscribe(res => {
                role.message = res.role_message;
                role.actions = [...res.actions];
              }, err => this.scMessageService.error(err));
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
                role.message = res.role_message;
                role.actions = [...res.actions];
              }, err => this.scMessageService.error(err));
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
            mode: 'checkin',
            photoRequired: this.shift.check_in_photo
          }
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            const roleStaffId = role.role_staff_id;
            try {
              const res = await this.scheduleService.checkInShiftRole(roleStaffId, result);
              role.message = res.role_message;
              role.actions = [...res.actions]
            } catch (e) {
              this.scMessageService.error(e);
            }
          }
        });
        break;

      case Action.check_out:
        dialogRef = this.dialog.open(StaffShiftCheckInOutDialogComponent, {
          disableClose: false,
          panelClass: 'staff-shift-check-in-out-dialog',
          data: {
            mode: 'checkout',
            photoRequired: this.shift.check_out_photo
          }
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            const roleStaffId = role.role_staff_id;
            try {
              const res = await this.scheduleService.checkOutShiftRole(roleStaffId, result);
              role.message = res.role_message;
              role.actions = [...res.actions];
            } catch (e) {
              this.scMessageService.error(e);
            }
          }
        });
        break;

      case Action.complete:
        dialogRef = this.dialog.open(StaffShiftCompleteDialogComponent, {
          disableClose: false,
          panelClass: 'staff-shift-complete-dialog',
          data: {
            roleStaffId: role.role_staff_id,
            // action,
            role
          }
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            const roleStaffId = role.role_staff_id;
            try {
              const res = await this.scheduleService.completeShiftRole(roleStaffId);
              role.message = res.role_message;
              role.actions = [...res.actions];
            } catch (e) {
              this.toastr.error(e.error.message);
            }
          }
        });
        break;

      case Action.expenses:

        break;

      case Action.invoice:
        // Open generating invoice tab
        tab = new Tab('New Invoice', 'generatePayrollTpl', 'staff/new-invoice', { from: this.shift.date });
        this.tabService.openTab(tab);
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

  getStyle(action) {
    let style;
    switch (action) {
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

  sum(payItems: any[]) {
    return payItems.reduce((ac, item) => ac + item.total, 0);
  }

  openPayItemDialog(payItems) {
    const dialogRef = this.dialog.open(StaffShiftPayItemDialogComponent, {
      data: { payItems }
    });
    dialogRef.afterClosed().subscribe(_ => { });
  }

  openScoreDialog(score) {
    if (_.isNil(score)) {
      return;
    } else {
      const dialogRef = this.dialog.open(FuseInfoDialogComponent, {
        disableClose: false,
        panelClass: 'fuse-info-dialog'
      });
      dialogRef.componentInstance.title = 'QuizConnect';
      dialogRef.componentInstance.message = `Your score: ${Math.round(score)}%`;
      dialogRef.afterClosed().subscribe(() => { });
    }
  }

}
