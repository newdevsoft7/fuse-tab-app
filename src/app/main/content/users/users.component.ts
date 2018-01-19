import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '../../../core/animations';
import { UserService } from './user.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
import { UserFormDialogComponent } from './dialogs/user-form/user-form.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UsersComponent implements OnInit {
    users: any[];
    filteredUsers: any[];
    selectedUsers: any[] = [];
    columns: any[];
    loadingIndicator = true;
    reorderable = true;

    dialogRef: any;

    @ViewChild(DatatableComponent) table: DatatableComponent
    @ViewChild('searchInput') search: ElementRef;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private userService: UserService) { }

    ngOnInit() {
        this.getUsers();
    }

    private getUsers() {
        this.userService.getUsers()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.users = res.users;
                this.columns = res.columns;
                this.updateFilter(this.search.nativeElement.value);
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
    }

    onSelect({ selected }) {
        this.selectedUsers.splice(0, this.selectedUsers.length);
        this.selectedUsers.push(...selected);
    }

    updateFilter(value) {
        const val = value.toLowerCase();

        const filteredUsers = this.users.filter(function (user) {
            return Object.keys(user).some(key => {
                return (user[key] ? user[key] : '')
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 || !val
            })
        });

        this.filteredUsers = filteredUsers;
        if (this.table) {
            this.table.offset = 0;
        }
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
                        this.toastr.success('Success!');
                        this.getUsers();
                    }, err => {
                        this.toastr.error('Error occurred!');
                    });
            });
    }

    onActivate(evt) {
    }

}
