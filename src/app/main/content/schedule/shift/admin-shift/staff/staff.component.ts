import { 
    Component, OnInit,
    ViewEncapsulation, Input,
    DoCheck, IterableDiffers,
    ViewChild
} from '@angular/core';

import {
    FormBuilder, FormGroup,
    Validators
} from '@angular/forms';

import {
    MatDialog, MatDialogRef,
    MAT_DIALOG_DATA,
    MatTabChangeEvent
} from '@angular/material';

import { STAFF_STATUS_SELECTED, STAFF_STATUS_STANDBY, STAFF_STATUS_APPLIED, STAFF_STATUS_REJECTED } from '../../../../../../constants/staff-status';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { UserService } from '../../../../users/user.service';
import { Tab } from '../../../../../tab/tab';
import { TabService } from '../../../../../tab/tab.service';
import { ActionService } from '../../../../../../shared/services/action.service';
import { ScheduleService } from '../../../schedule.service';
import { StaffStatus } from '../../../../../../constants/staff-status-id';

export enum Section {
    Selected = 0,
    Standby = 1,
    Applicants = 2,
    NA = 3
};

export enum Query {
    Counts = 'counts',
    Selected = 'selected',
    Standby = 'standby',
    Applicants = 'applicants',
    Na = 'na'
};

@Component({
    selector: 'app-admin-shift-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffComponent implements OnInit {

    currentUser;
    userInfo: any;
    roles: any[];

    public Section = Section;

    @Input() shift;
    
    @ViewChild('adminNoteInput') adminNoteInput;

    canSavePost = false;

    adminNotes: any[];
    isSeeAllAdminNotes = false;
    adminNoteForm: FormGroup;

    public StaffStatus = StaffStatus;

    readonly StaffStatusesSelected = [
        StaffStatus.Selected,
        StaffStatus.Confirmed,
        StaffStatus.CheckedInAttempted,
        StaffStatus.CheckedIn,
        StaffStatus.NoShow,
        StaffStatus.CheckedOut,
        StaffStatus.Completed,
        StaffStatus.Invoiced,
        StaffStatus.Paid
    ];

    constructor(
        private loadingService: CustomLoadingService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private tokenStorage: TokenStorage,
        private userService: UserService,
        private scheduleService: ScheduleService,
        private actionService: ActionService,
        private tabService: TabService,
        private loadingSerivce: CustomLoadingService,
        differs: IterableDiffers) {
            this.currentUser = this.tokenStorage.getUser();
    }

    ngOnInit() {
        this.adminNoteForm = this.formBuilder.group({
            type: ['info', Validators.required],
            note: ['', Validators.required]
        });

        
        this.adminNoteForm.valueChanges.subscribe(() => {
            this.onAdminNoteFormValuesChanged();
        });
        
        this.userService.getUser(this.currentUser.id).subscribe(res => {
            this.userInfo = res;

            if (['owner', 'admin'].includes(this.currentUser.lvl)) {
                this.refreshAdminNotesView();
            }
        });

        this.roles = this.shift.shift_roles.map(role => {

            // Get selected from shift role staff
            const selected = role.role_staff.filter(rs => {
               return true; 
            });
            return {
                ...role,
                selected,
                section: Section.Selected,
                shiftTitle: this.shift.title,
            };
        });

        // Add Users to Role
        this.actionService.usersToRole.subscribe(
            ({ userIds, role, section }) => {
                const staffStatusId = mapSectionToStaffStatus(section);
                this.loadingSerivce.showLoadingSpinner();
                this.scheduleService.assignStaffsToRole(userIds, role.id, staffStatusId)
                    .subscribe(res => {
                        this.loadingSerivce.hideLoadingSpinner();
                        this.refreshTabByRole(role, section);
                        this.updateStaffsCount(role.id);
                        this.toastr.success(`${res.length > 1 ? 'Users' : 'User'} assigned`);
                    }, err => {
                        this.loadingSerivce.hideLoadingSpinner();
                        this.updateStaffsCount(role.id);
                        this.refreshTabByRole(role, section);
                        this.toastr.error('Error!');
                    })
            });
    }

    onSelectedTabChange(role, event: MatTabChangeEvent) {
        const selectedTab = event.index;
        const roleId = role.id;
        const shiftId = this.shift.id;

        this.refreshTabByRole(role, selectedTab);
    }

    private refreshTabByRole(role, selectedTab: Section) {
        switch (selectedTab) {
            case Section.Selected:
                this.scheduleService.getRoleStaffs(role.id, Query.Selected)
                    .subscribe(res => {
                        const index = this.roles.findIndex(v => v.id === role.id);
                        this.roles[index].selected = res.role_staff;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.Standby:
                this.scheduleService.getRoleStaffs(role.id, Query.Standby)
                    .subscribe(res => {
                        const index = this.roles.findIndex(v => v.id === role.id);
                        this.roles[index].standby = res.role_staff;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.Applicants:
                this.scheduleService.getRoleStaffs(role.id, Query.Applicants)
                    .subscribe(res => {
                        const index = this.roles.findIndex(v => v.id === role.id);
                        this.roles[index].applicants = res.role_staff;
                    }, err => {
                        this.toastr.error(err.error.message);
                    });
                break;

            case Section.NA:
                this.scheduleService.getRoleStaffs(role.id, Query.Na)
                    .subscribe(res => {
                        const index = this.roles.findIndex(v => v.id === role.id);
                        this.roles[index].na = res.role_staff;
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
        const filter = [];
        const data = {
            filter,
            role,
            tab: `admin-shift/${this.shift.id}`
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
                }
            })
    }

    private refreshAdminNotesView() {
        if (this.isSeeAllAdminNotes) {
            this.adminNotes = this.userInfo.profile_admin_notes;
        } else {
            this.adminNotes = this.userInfo.profile_admin_notes.slice(0, 5);
        }
    }

    onAdminNoteFormValuesChanged() {
        const note = this.adminNoteForm.getRawValue().note;
        if (note.length > 0) {
            this.canSavePost = true;
        } else {
            this.canSavePost = false;
        }
    }

    onSeeAllAdminNotes() {
        this.isSeeAllAdminNotes = true;
        this.refreshAdminNotesView();
    }

    onPostAdminNote() {
        const data = this.adminNoteForm.value;
        this.userService.createAdminNote(this.currentUser.id, data)
            .subscribe(res => {
                const note = res.data;
                note.creator_thumbnail = this.userInfo.ppic_a;
                note.creator_name = `${this.userInfo.fname} ${this.userInfo.lname}`;


                this.userInfo.profile_admin_notes.unshift(note);
                this.refreshAdminNotesView();

                this.adminNoteInput.nativeElement.value = '';
                this.adminNoteInput.nativeElement.focus();
            }, err => {
                this.displayError(err);
            });
    }

    onDeleteAdminNote(note) {
        const index = this.userInfo.profile_admin_notes.findIndex(v => v.id == note.id);
        this.userService.deleteAdminNote(note.id)
            .subscribe(res => {
                this.userInfo.profile_admin_notes.splice(index, 1);
                this.refreshAdminNotesView();
            }, err => {
                this.displayError(err);
            });
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }
}

function mapSectionToStaffStatus(section) {
    switch(section) {
        case Section.Selected:
            return STAFF_STATUS_SELECTED;
        
        case Section.Standby:
            return STAFF_STATUS_STANDBY;

        case Section.Applicants:
            return STAFF_STATUS_APPLIED;

        case Section.NA:
            return STAFF_STATUS_REJECTED;

        default:
            return '';
    }
}
