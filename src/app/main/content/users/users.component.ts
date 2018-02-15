import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
import { UserFormDialogComponent } from './dialogs/user-form/user-form.component';
import { Tab } from '../../tab/tab';
import { TabService } from '../../tab/tab.service';

const DEFAULT_PAGE_SIZE = 5;

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
    users: any[];
    selectedUsers: any[] = [];
    columns: any[];

    pageNumber: number;
    pageSize: number;
    total: number;

    filters = [];
    sorts: any[];

    typeFilters;
    selectedTypeFilter = 'utype:=:all'  // All Active Users

    loadingIndicator = true;
    reorderable = true;

    dialogRef: any;

    @ViewChild(DatatableComponent) table: DatatableComponent

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private userService: UserService,
        private tabService: TabService) { }

    ngOnInit() {
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

    private getUsers(params = null) {
        const query = {
            pageSize: DEFAULT_PAGE_SIZE,
            filters: this.mergeAllFilters(),
            sorts: this.sorts,
            ...params
        };
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

    onActivate(evt) {
    }

    setPage(pageInfo) {
        this.pageNumber = pageInfo.offset;
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
}
