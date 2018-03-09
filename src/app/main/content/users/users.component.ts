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


const DEFAULT_PAGE_SIZE = 5;
const USERS_TAB = 'users';

export enum Mode {
    Normal, // Users
    Shift,  // Add Users to Shift
    Role
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

    typeFilters;
    selectedTypeFilter = 'utype:=:all'  // All Active Users
    
    mode: Mode = Mode.Normal; // Normal
    public Mode = Mode;

    loadingIndicator = true;
    reorderable = true;
    
    dialogRef: any;
    
    differ: any;
    
    @ViewChild(DatatableComponent) table: DatatableComponent

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
    }

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private userService: UserService,
        private tokenStorage: TokenStorage,
        private actionService: ActionService,
        private tabService: TabService) { }

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();
        this.init();
    }

    private async init() {
        try {
            this.typeFilters = await this.userService.getUsersTypeFilters();
            this.getUsers();
        } catch (e) {
            console.log(e);
        }
    }

    onPageLengthChange(event) {
        this.getUsers({pageSize: event.value});
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
                if (err.status && err.status == 403) {
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

    toggleFav(user, evt: Event) {
        user.fav = user.fav === 1 ? 0 : 1;
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
                        this.toastr.success(res.message);
                        this.getUsers();
                    }, err => {
                        const errors = err.error.errors;
                        Object.keys(errors).forEach(v => {
                            this.toastr.error(errors[v]);
                        });
                    });
            });
    }

    // Add users to roles
    addUsersToShift() {
        if (!this.selectedUsers.length) { return false; }
        // TODO
        this.tabService.closeTab(USERS_TAB);
        this.tabService.openTab(this.data.tab);
    }

    addUsersToRole() {
        if (!this.selectedUsers.length) { return false; }
        // TODO
        const userIds = this.selectedUsers.map(user => user.id);
        const section = this.data.role.section;
        const role = this.data.role;

        this.actionService.addUsersToRole({ userIds, section, role });
        this.tabService.closeTab(USERS_TAB);

        // TODO - Select tab by user level
        let template = 'shiftTpl';

        if (['owner', 'admin'].includes(this.currentUser.lvl)) {
            template = 'adminShiftTpl';
        }
        this.tabService.openTab(new Tab(this.data.shiftTitle, template, this.data.tab, { id: this.data.role.shift_id, url: this.data.tab }));
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
        this.filters = evt.map(v => v.id);
        this.getUsers();
    }

    onTypeFilterChange(filter) {
        this.selectedTypeFilter = filter;
        this.getUsers();
    }

    private mergeAllFilters(): any[] {
        return [this.selectedTypeFilter, ...this.filters];
    }

    onSort(event) {
        this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
        this.getUsers();
    }

    min(x, y) {
        return Math.min(x, y);
    }

}
