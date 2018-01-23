import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
    selector: 'app-users-profile-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class UsersProfileAboutComponent implements OnInit {

    @Input() userInfo;
    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
    }

    get isOwner() {
        return this.userInfo.lvl == 'owner';
    }

    get isAdmin() {
        return this.userInfo.lvl == 'admin';
    }

    get isStaff() {
        return this.userInfo.lvl == 'staff';
    }

    get isRegistrant() {
        return this.userInfo.lvl.indexOf('registrant') > -1;
    }

}
