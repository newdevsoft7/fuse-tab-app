import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-users-profile-workareas',
    templateUrl: './workareas.component.html',
    styleUrls: ['./workareas.component.scss']
})
export class UsersProfileWorkAreasComponent implements OnInit {

    @Input() userInfo;
    @Input() currentUser;

    workAreas = [];

    constructor(
        private userService: UserService) { }

    ngOnInit() {
        this.getWorkAreas();
    }

    onUpdateWorkArea(workArea) {
        const value = workArea.set ? 1 : 0;
        this.userService.updateProfileWorkArea(this.userInfo.id, workArea.id, value).subscribe(
            res => {
            },
            err => {
                console.log(err);
            }
        );
    }

    private getWorkAreas() {
        this.userService.getProfileWorkAreas(this.userInfo.id).subscribe(
            res => {
                this.workAreas = res;
            },
            err => {
                console.log(err);
            }
        );
    }

}
