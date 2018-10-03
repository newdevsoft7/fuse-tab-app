import {
    Component, OnInit,
    ViewEncapsulation, ViewChild,
    ElementRef, Input
} from '@angular/core';

import { MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import * as _ from 'lodash';

import { TabService } from '../../tab/tab.service';
import { UserService } from './user.service';
import { ActionService } from '../../../shared/services/action.service';
import { UserFormDialogComponent } from './dialogs/user-form/user-form.component';
import { Tab } from '../../tab/tab';
import { TokenStorage } from '../../../shared/services/token-storage.service';
import { fuseAnimations } from '../../../core/animations';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { AssignReportDialogComponent} from './dialogs/assign-report/assign-report.component';
import { TAB } from '../../../constants/tab';
import { FuseConfirmYesNoDialogComponent } from '../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';
import { UserPasswordDialogComponent } from './dialogs/password/password.component';
import { AddToPresenationDialogComponent } from './dialogs/add-to-presenation-dialog/add-to-presenation-dialog.component';
import { SCMessageService } from '../../../shared/services/sc-message.service';
import { environment } from '../../../../environments/environment';



const DEFAULT_PAGE_SIZE = 20;
const USERS_TAB = 'users';

export enum Mode {
    Normal, // Users
    Role,
    Invite,
    Select
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UsersComponent implements OnInit {

    currentUser;
    users: any[];
    selectedUsers: any[] = [];
    columns: any[];

    pageNumber: number;
    pageSize = DEFAULT_PAGE_SIZE;
    total: number;
    pageLengths = [5, 10, 20, 50, 100];

    filters = [];
    sorts: any[];

    selectedTypeFilter = 'utype:=:all'; // All Active Users

    mode: Mode = Mode.Normal; // Normal
    public Mode = Mode;

    loadingIndicator = true;
    reorderable = true;

    dialogRef: any;

    differ: any;
    isLoginAs: boolean = true;
    environment = environment;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    _data;
    @Input('data')
    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        if (this._data && this._data.role) {
            this.mode = Mode.Role;
        }

        if (this._data && this._data.invite) {
            this.mode = Mode.Invite;
        }

        if (this._data && this._data.select) {
            this.mode = Mode.Select;
        }
    }

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private userService: UserService,
        private tokenStorage: TokenStorage,
        private actionService: ActionService,
        private tabService: TabService,
        private authService: AuthenticationService,
        private scMessageService: SCMessageService,
        private router: Router
    ) {
        this.currentUser = this.tokenStorage.getUser();
    }

    async ngOnInit() {

        if (this.data.selectedTypeFilter) {
            this.filters = [];
            this.selectedTypeFilter = this.data.selectedTypeFilter;
        }

        // For invitation to a shift
        if (this.data.invite) {
            this.data.invite_all = true;
            this.filters = this.data.filters;
            this.selectedTypeFilter = 'utype:=:staff';
            if (this.data.selectedRoleId) {
                try {
                    await this.onRoleChange();
                } catch (e) { }
            }
        }

        // For assigning to a shift
        if (this.data.select) {
            this.data.select_all = true;
            this.filters = this.data.filters;
            this.selectedTypeFilter = 'utype:=:staff';
            if (this.data.selectedRoleId) {
                try {
                    await this.onRoleChange();
                } catch (e) { }
            }
        }

        this.init();
    }

    private init() {
        this.getUsers();
    }

    onPageLengthChange(event) {
        this.getUsers({ pageSize: event.value });
    }

    private getUsers(params = null) {
        const query = {
            pageSize: this.pageSize,
            filters: this.mergeAllFilters(),
            sorts: this.sorts,
            ...params
        };
        this.loadingIndicator = true;
        this.userService.getUsers(query).subscribe(
            res => {
                this.loadingIndicator = false;
                this.users = res.data;
                this.columns = res.columns;
                this.pageSize = res.page_size;
                this.pageNumber = res.page_number;
                this.total = res.total_counts;
            },
            err => {
                this.loadingIndicator = false;
                if (err.status && err.status === 403) {
                    this.toastr.error('You have no permission!');
                }
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

    async toggleFav(user, evt: Event) {
        user.fav = user.fav === 1 ? 0 : 1;
        try {
            const res = await this.userService.updateUser(user.id, { fav: user.fav });
        } catch (e) {
            this.scMessageService.error(e);
            user.fav = user.fav === 1 ? 0 : 1;
        }
            evt.stopPropagation();
        }

    openUserTab(user, event: Event) {
        event.stopPropagation();
        const tab = new Tab(`${user.fname} ${user.lname}`, 'usersProfileTpl', `users/user/${user.id}`, user);
        this.tabService.openTab(tab);
    }

    onSelect({ selected }) {
        this.selectedUsers.splice(0, this.selectedUsers.length);
        this.selectedUsers.push(...selected);

        // For invitation to a shift
        if (this.data.invite && selected.length > 0) {
            this.data.invite_all = false;
        }
    }

    toggleSelect() {
        const selectedIds = this.selectedUsers.map(v => v.id);
        this.selectedUsers.splice(0, this.selectedUsers.length);
        const selected = this.users.filter(v => selectedIds.indexOf(v.id) < 0);
        this.selectedUsers.push(...selected);
        this.table.bodyComponent.recalcLayout();
    }

    selectAll() {
        this.selectedUsers.splice(0, this.selectedUsers.length);
        this.selectedUsers.push(...this.users);
        this.table.bodyComponent.recalcLayout();
    }

    deleteUser(user) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    const res = await this.userService.deleteUser(user.id);
                    this.getUsers();
                } catch (e) {
                    const errors = e.error.errors;
                    Object.keys(errors).forEach(v => {
                        this.toastr.error(errors[v]);
                    });
                }
            }
        });
    }

    openAssignReportDialog() {
        this.dialogRef = this.dialog.open(AssignReportDialogComponent, {
            panelClass: 'user-assign-report-dialog',
        });

        this.dialogRef.afterClosed()
            .subscribe((assignedReport) => {
                if (assignedReport) {
                    const userIds = this.selectedUsers.map(user => user.id);
    
                    const data = {
                        'user_ids' : userIds,
                        'deadline' : assignedReport.deadline,
                        'completions' : assignedReport.completitions,
                    };
    
                    this.userService.assignReport(assignedReport.id, data).subscribe(
                        res => {

                        }, err => {
                            console.log(err);
                        });
                }
            });
    }

    openNewUser() {
        this.dialogRef = this.dialog.open(UserFormDialogComponent, {
            panelClass: 'user-form-dialog',
        });

        this.dialogRef.afterClosed()
            .subscribe((user) => {
                if (!user) {
                    return;
                }
                this.userService
                    .createUser(user)
                    .subscribe(res => {
                        this.getUsers();
                    }, err => {
                        const errors = err.error.errors;
                        Object.keys(errors).forEach(v => {
                            this.toastr.error(errors[v]);
                        });
                    });
            });
    }

    addUsersToRole() {
        if (!this.selectedUsers.length) { return false; }
        // TODO
        const userIds = this.selectedUsers.map(user => user.id);
        const section = this.data.role.section;
        const role = this.data.role;

        this.actionService.addUsersToRole({ userIds, section, role });
        this.tabService.closeTab(USERS_TAB);
    }

    onActivate(evt) {
    }

    setPage(pageInfo) {
        this.pageNumber = pageInfo.page - 1;
        this.getUsers({
            pageNumber: this.pageNumber
        });
    }

    onFiltersChange(evt: any[]) {
        this.filters = evt;
        this.getUsers();

        if (this.data.invite) {
            this.data.invite_all = true;
        }
        if (this.data.select) {
            this.data.select_all = true;
        }
    }

    onTypeFilterChange(filter) {
        this.selectedTypeFilter = filter;
        if (this.selectedTypeFilter.endsWith('incomplete') || this.selectedTypeFilter.endsWith('complete') || this.selectedTypeFilter.endsWith('rejected')) {
            this.isLoginAs = false;
        } else {
            this.isLoginAs = true;
        }
        this.getUsers();

        if (this.data.invite) {
            this.data.invite_all = true;
        }
        if (this.data.select) {
            this.data.select_all = true;
        }
    }

    private mergeAllFilters(): any[] {
        return [this.selectedTypeFilter, ...this.filters.map(v => v.id)];
    }

    onSort(event) {
        this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
        this.getUsers();
    }

    min(x, y) {
        return Math.min(x, y);
    }

    async loginAsUser(user: any) {
        try {
            const res = await this.authService.loginAs(user.id);
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

    invite(messaging: boolean) {
        const shiftId = this.data.shiftId;
        const filters = this.filters.map(v => v.id);
        const role = { id: this.data.selectedRoleId };
        const userIds = this.selectedUsers.map(v => v.id);
        const inviteAll = this.data.invite_all;
        if (!this.data.selectedRoleId) { return; }
        if ((this.data.invite_all && this.total === 0) || (!this.data.invite_all && _.isEmpty(userIds))) { return; }
        if (messaging) {
            this.openMessageTab();
        } else {
            // Invite Staffs
            this.actionService.inviteUsersToRole({ shiftId, userIds, filters, role, inviteAll });
        }
        this.removeInvitationBar();
    }

    select(messaging: boolean) {
        const shiftId = this.data.shiftId;
        const role = { id: this.data.selectedRoleId };
        const userIds = this.selectedUsers.map(v => v.id);
        if (!this.data.selectedRoleId) { return; }
        if (this.total === 0 || _.isEmpty(userIds)) { return; }

        if (messaging) {
            this.openMessageTab();
        } else {
            // select Staffs
            this.actionService.selectUsersToRole({ shiftId, userIds, role });
        }
        this.removeSelectBar();
    }

    async onRoleChange() {
        try {
            this.filters = await this.userService.getRoleRequirementsByRole(this.data.selectedRoleId);
        } catch (e) { }
    }

    removeInvitationBar() {
        this.data.invite = false;
        this.resetFilters();
    }

    removeSelectBar() {
        this.data.select = false;
        this.resetFilters();
    }

    openMessageTab() {
        const users = this.data.invite_all ? this.users : this.selectedUsers;
        if (users.length < 1) { return; }
        const tab = _.cloneDeep(TAB.USERS_NEW_MESSAGE_TAB);
        tab.data.recipients = users.map(v => {
          return {
            id: v.id,
            text: `${v.fname} ${v.lname}`
          };
        });
        this.tabService.openTab(tab);
    }

    private resetFilters() {
        this.selectedTypeFilter = 'utype:=:all';
        this.selectedUsers = [];
        this.filters = [];
        this.getUsers();
    }

    onTypeChange(user, type) {
        let body: any;
        switch (type) {
            case 'admin':
            case 'owner':
            case 'staff':
                body = { lvl: type };
                break;
            case 'inactive':
            case 'active':
            case 'blacklisted':
                body = { active: type };
                break;
        }
        const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    await this.userService.updateUser(user.id, body);
                    this.getUsers();
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    openPasswordDialog(user) {
        const dialogRef = this.dialog.open(UserPasswordDialogComponent, {
            disableClose: false,
            panelClass: 'user-password-form-dialog'
        });
        dialogRef.afterClosed().subscribe(async (password) => {
            if (password) {
                try {
                    await this.userService.changePassword(user.id, password).toPromise();
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    openAddToPresentationDialog() {
        const dialogRef = this.dialog.open(AddToPresenationDialogComponent, {
            disableClose: false,
            panelClass: 'add-to-presentation-dialog',
            data: {
                users: this.selectedUsers.map(v => v.id)
            }
        });
        dialogRef.afterClosed().subscribe(async(result) => {

        });
    }

}
