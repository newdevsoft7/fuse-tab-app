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

    onValueChanged(value: any) {
        console.log(value);
    }

    onBasicValueChanged(value: string) {
        // PROFILE_ELEMENT_FNAME
        // PROFILE_ELEMENT_LNAME
        // PROFILE_ELEMENT_ALIAS
        // PROFILE_ELEMENT_DOB
        // PROFILE_ELEMENT_SEX
        // PROFILE_ELEMENT_EMAIL
        // PROFILE_ELEMENT_AGE
        // PROFILE_ELEMENT_MOBILE
        // PROFILE_ELEMENT_ADDRESS
        // PROFILE_ELEMENT_UNIT
        // PROFILE_ELEMENT_CITY
        // PROFILE_ELEMENT_STATE
        // PROFILE_ELEMENT_POSTCODE
        // PROFILE_ELEMENT_ID
        // PROFILE_ELEMENT_STATUS
        // PROFILE_ELEMENT_PERFORMANCE
        // PROFILE_ELEMENT_ID2
        


    }

}
