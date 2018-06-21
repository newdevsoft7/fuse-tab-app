import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTabChangeEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { TabService } from '../../../../../tab/tab.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../../schedule.service';
import { ActionService } from '../../../../../../shared/services/action.service';
import {
    STAFF_STATUS_SELECTED, STAFF_STATUS_HIDDEN_REJECTED, STAFF_STATUS_REJECTED,
    STAFF_STATUS_APPLIED, STAFF_STATUS_STANDBY, STAFF_STATUS_CONFIRMED,
    STAFF_STATUS_CHECKED_IN, STAFF_STATUS_CHECKED_OUT, STAFF_STATUS_COMPLETED,
    STAFF_STATUS_INVOICED, STAFF_STATUS_PAID, STAFF_STATUS_NO_SHOW, STAFF_STATUS_INVITED
} from '../../../../../../constants/staff-status';
import { Tab } from '../../../../../tab/tab';


enum Section {
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
    selector: 'app-group-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class GroupStaffComponent implements OnInit, OnDestroy {

    @Input() group;
    @Input() shifts = [];
    @ViewChild('adminNoteInput') adminNoteInput;

    adminNotes: any[] = [];
    adminNoteTypes: any[] = [];
    adminNoteForm: FormGroup;
    canSavePost = false;
    noteTemp: any; // Note template for update

    noteTypes = [
        { value: 0, label: 'Default' }
    ];

    noteClientVisibles = [
        { value: 0, label: 'Admin Only' },
        { value: 1, label: 'Admin & Client' }
    ];

    Section = Section;
    currentUser: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    usersToRoleSubscription: Subscription;
    deleteRoleSubscrpition: Subscription;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private formBuilder: FormBuilder,
        private tabService: TabService,
        private actionService: ActionService,
        private tokenStorage: TokenStorage,
        private scheduleService: ScheduleService,
    ) {
        this.currentUser = this.tokenStorage.getUser();

        this.usersToRoleSubscription = this.actionService.usersToRole.subscribe(
            ({ userIds, role, section }) => {
                const index = this.shifts.findIndex(v => v.id === role.shift_id);
                if (index > -1) {
                    const staffStatusId = mapSectionToStaffStatus(section);
                    this.spinner.show();
                    this.scheduleService.assignStaffsToRole(userIds, role.id, staffStatusId)
                        .subscribe(res => {
                            this.spinner.hide();
                            this.refreshTabByRole(role, section);
                            this.updateStaffsCount(role);
                            //this.toastr.success(`${res.length > 1 ? 'Users' : 'User'} assigned`);
                        }, err => {
                            this.spinner.hide();
                            this.updateStaffsCount(role);
                            this.refreshTabByRole(role, section);
                            this.toastr.error('Error!');
                        });
                }
            });
        
        this.deleteRoleSubscrpition = this.actionService.deleteRole$.subscribe((roleIds: any[]) => {
            this.shifts.forEach((shift, idx) => {
                this.shifts[idx].shift_roles = shift.shift_roles.filter(r => roleIds.indexOf(r.id) < 0);
            });
        });
    }

    ngOnInit() {
        this.shifts.forEach(shift => {
            shift.shift_roles.forEach((role, index) => {
                shift.shift_roles[index] = {
                    ...role,
                    index,
                    shift_id: shift.id,
                    selected: role.role_staff,
                    section: Section.Selected
                };
            });
        });

        this.adminNoteTypes = this.tokenStorage.getSettings().admin_note_types || [];
        const type_id = this.adminNoteTypes.length > 0 ? this.adminNoteTypes[0].id : '';
        this.adminNoteForm = this.formBuilder.group({
            shift_id: [this.group.shift_options[0].id, Validators.required],
            type_id: [type_id],
            client_visible: [0, Validators.required],
            note: ['', Validators.required]
        });

        this.adminNoteForm.valueChanges.subscribe(() => {
            this.onAdminNoteFormValuesChanged();
        });

        this.scheduleService.getGroupAdminNotes(this.group.id)
            .subscribe(res => {
                this.adminNotes = res;
            });
    }

    onAdminNoteFormValuesChanged() {
        const note = this.adminNoteForm.getRawValue().note;
        if (note.length > 0) {
            this.canSavePost = true;
        } else {
            this.canSavePost = false;
        }
    }

    onDeleteAdminNote(note) {
        const index = this.adminNotes.findIndex(v => v.id === note.id);
        this.spinner.show();
        this.scheduleService.deleteShiftAdminNote(note.id)
            .subscribe(res => {
                this.spinner.hide();
                this.adminNotes.splice(index, 1);
            }, err => {
                this.spinner.hide();
                this.displayError(err);
            });
    }

    onUpdateAdminNote(note) {
        const index = this.adminNotes.findIndex(v => v.id === note.id);

        // Update note
        this.spinner.show();
        this.scheduleService.updateAdminNote(
            note.id,
            {
                note: this.noteTemp.note,
                type_id: this.noteTemp.type_id === null ? '' : this.noteTemp.type_id,
                client_visible: this.noteTemp.client_visible
            }
        ).subscribe(res => {
            this.spinner.hide();
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
        }, err => {
            this.spinner.hide();
            this.displayError(err);
        });
        note.editMode = false;
    }

    onEditAdminNote(note) {
        note.editMode = true;
        this.noteTemp = _.cloneDeep(note);
    }

    onCancelEditAdminNote(note) {
        note.editMode = false;
    }

    getNoteClientVisible(noteClientVisible) {
        const visible = this.noteClientVisibles.find(v => v.value === noteClientVisible);
        return visible ? visible.label : '';
    }

    getShiftTitle(id) {
        const option = this.group.shift_options.find(v => v.id === id);
        return option ? option.text : '';
    }

    openShift(shift) {
        const url = `admin/shift/${shift.id}`;
        const tab = new Tab(
            shift.title,
            'adminShiftTpl',
            url,
            { url, id: shift.id }
        );
        this.tabService.openTab(tab);
    }

    ngOnDestroy() {
        this.usersToRoleSubscription.unsubscribe();
        this.deleteRoleSubscrpition.unsubscribe();
    }

    onPostAdminNote() {
        const data = this.adminNoteForm.value;
        this.canSavePost = false;
        this.spinner.show();
        this.scheduleService.createShiftAdminNote(data.shift_id, data)
            .subscribe(res => {
                this.spinner.hide();
                const note = res.data;
                note.creator_ppic_a = this.currentUser.ppic_a;
                note.creator_name = `${this.currentUser.fname} ${this.currentUser.lname}`;
                note.shift_id = data.shift_id;

                if (this.adminNoteTypes.length > 0 && note.type_id != null) {
                    const noteType = this.adminNoteTypes.find(v => v.id === note.type_id);
                    note.color = noteType.color;
                    note.tname = noteType.tname;
                }

                this.adminNotes.unshift(note);

                this.adminNoteInput.nativeElement.value = '';
                this.adminNoteInput.nativeElement.focus();
            }, err => {
                this.spinner.hide();
                this.displayError(err);
            });
    }

    moveup(shift, role) {
        const index = role.index;
        if (index === 0) { return; }
        this.scheduleService.UpdateRoleDisplayOrder(role.id, 'up').subscribe(res => {
            shift.shift_roles[index].index = index - 1;
            shift.shift_roles[index - 1].index = index;
            shift.shift_roles = shift.shift_roles.sort((a, b) => a.index - b.index);
        });
    }

    movedown(shift, role) {
        const index = role.index;
        if (index === shift.shift_roles.length - 1) { return; }
        this.scheduleService.UpdateRoleDisplayOrder(role.id, 'down').subscribe(res => {
            shift.shift_roles[index].index = index + 1;
            shift.shift_roles[index + 1].index = index;
            shift.shift_roles = shift.shift_roles.sort((a, b) => a.index - b.index);
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
                    .subscribe(res => {
                        //this.toastr.success(`Status${res.length > 1 ? 'es' : ''} updated.`);
                        this.updateStaffsBySection(role);
                    }, err => {
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
                role[query] = res.role_staff;
            });
        this.updateStaffsCount(role);
    }

    private refreshTabByRole(role, selectedTab: Section) {
        const roles = this.shifts.find(v => v.id === role.shift_id).shift_roles;
        switch (selectedTab) {
            case Section.Selected:
                this.scheduleService.getRoleStaffs(role.id, Query.Selected)
                    .subscribe(res => {
                        const index = roles.findIndex(v => v.id === role.id);
                        roles[index].selected = res;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.Standby:
                this.scheduleService.getRoleStaffs(role.id, Query.Standby)
                    .subscribe(res => {
                        const index = roles.findIndex(v => v.id === role.id);
                        roles[index].standby = res;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.Applicants:
                this.scheduleService.getRoleStaffs(role.id, Query.Applicants)
                    .subscribe(res => {
                        const index = roles.findIndex(v => v.id === role.id);
                        roles[index].applicants = res;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.Invited:
                this.scheduleService.getRoleStaffs(role.id, Query.Invited)
                    .subscribe(res => {
                        const index = roles.findIndex(v => v.id === role.id);
                        roles[index].invited = res;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.NA:
                this.scheduleService.getRoleStaffs(role.id, Query.Na)
                    .subscribe(res => {
                        const index = roles.findIndex(v => v.id === role.id);
                        roles[index].na = res;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            default:
                break;
        }
    }

    updateStaffsCount(role) {
        const shift = this.shifts.find(v => v.id === role.shift_id);
        role = shift.shift_roles.find(v => v.id === role.id);
        this.scheduleService.getRoleStaffsCounts(role.id)
            .subscribe(res => {
                role['num_selected'] = res.num_selected;
                role['num_standby'] = res.num_standby;
                role['num_applicants'] = res.num_applicants;
                role['num_na'] = res.num_na;
                role['num_invited'] = res.num_invited;
            });
    }

    onSelectedTabChange(role, event: MatTabChangeEvent) {
        const selectedTab = event.index;
        this.refreshTabByRole(role, selectedTab);
    }

    async onEditRole(shift, role) {
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
                    role: { ...data, shift_title: shift.title }
                });
            this.tabService.closeTab(url);
            this.tabService.openTab(roleTab);
        } catch (e) {
            this.spinner.hide();
            this.toastr.error(e.error.message || 'Something is wrong!');
        }
    }

    onInviteStaffToRole(shift, role) {
        const roles = shift.shift_roles.map(v => {
            return {
                id: v.id,
                name: v.rname
            };
        });
        const data = {
            roles,
            shiftId: shift.id,
            invite: true,
            filters: [],
            title: shift.title,
            selectedRoleId: role.id
        };

        this.tabService.closeTab('users');
        const tab = new Tab('Users', 'usersTpl', 'users', data);

        this.tabService.openTab(tab);
    }

    onAddStaffToRole(role) {
        const roles = this.shifts.find(v => v.id === role.shift_id).shift_roles.map(v => {
            return {
                id: v.id,
                name: v.rname
            };
        });
        const filters = [];
        const data = {
            roles,
            shiftId: role.shift_id,
            select: true,
            filters,
            selectedRoleId: role.id,
            tab: `admin/shift/${role.shift_id}`
        };

        this.tabService.closeTab('users');
        const tab = new Tab('Users', 'usersTpl', 'users', data);

        this.tabService.openTab(tab);
    }

    inviteStaffs({ shiftId, userIds, filters, role, inviteAll }) {
        const body: any = {};
        if (inviteAll) {
            body.filters = filters;
        } else {
            body.user_ids = userIds;
        }
        role = { ...role, shift_id: shiftId };
        this.spinner.show();
        this.scheduleService.inviteStaffsToRole(role.id, body).subscribe(
            res => {
                this.spinner.hide();
                this.refreshTabByRole(role, Section.Invited);
                this.updateStaffsCount(role);
                const roles = this.shifts.find(v => v.id === role.shift_id).shift_roles;
                const index = roles.findIndex(v => v.id === role.id);
                roles[index].section = Section.Invited;
                //this.toastr.success(res.message);
            },
            err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            });
    }

    selectStaffs({ shiftId, userIds, role }) {
        const body: any = {};
        body.user_ids = userIds;
        role = { ...role, shift_id: shiftId };
        this.spinner.show();
        this.scheduleService.assignStaffsToRole(userIds, role.id, STAFF_STATUS_SELECTED).subscribe(
            res => {
                this.spinner.hide();
                this.refreshTabByRole(role, Section.Selected);
                this.updateStaffsCount(role);
                const roles = this.shifts.find(v => v.id === role.shift_id).shift_roles;
                const index = roles.findIndex(v => v.id === role.id);
                roles[index].section = Section.Selected;
                //this.toastr.success(res.message);
            },
            err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            });
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