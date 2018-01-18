import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { UserService } from './user.service';

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
    loadingIndicator = true;
    reorderable = true;

    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getUsers()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.users = res.users;
                this.columns = res.columns;
            });
    }

    getAvatar(value) {
        switch (value) {
            case 'male_tthumb.jpg':
            case 'female_tthumb.jpg':
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

    openContextMenu(evt: Event) {
        evt.preventDefault();
        this.contextMenu.openMenu();
    } 

    onSelect({ selected }) {
        this.selectedUsers.splice(0, this.selectedUsers.length);
        this.selectedUsers.push(...selected);
    }

    onActivate(evt) {
    }

}
