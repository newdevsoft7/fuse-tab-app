import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-users-profile-attributes',
    templateUrl: './attributes.component.html',
    styleUrls: ['./attributes.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileAttributesComponent implements OnInit {

    @Input() userInfo;
    @Input() currentUser;

    constructor(userService: UserService) { }

    ngOnInit() {
    }

}
