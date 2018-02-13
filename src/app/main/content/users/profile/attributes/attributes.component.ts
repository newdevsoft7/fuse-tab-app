import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-users-profile-attributes',
    templateUrl: './attributes.component.html',
    styleUrls: ['./attributes.component.scss']
})
export class UsersProfileAttributesComponent implements OnInit {

    @Input() userInfo;
    @Input() currentUser;

    attributes = [];

    constructor(
        private userService: UserService) { }

    ngOnInit() {
        this.getAttributes();
    }

    onUpdateAttribute(attr) {
        const value = attr.set ? 1 : 0;
        this.userService.updateProfileAttribute(this.userInfo.id, attr.id, value).subscribe(
            res => {
            },
            err => {
                console.log(err);
            }
        );
    }

    private getAttributes() {
        this.userService.getProfileAttributes(this.userInfo.id).subscribe(
            res => {
                this.attributes = res;
            },
            err => {
                console.log(err);
            }
        );
    }

}
