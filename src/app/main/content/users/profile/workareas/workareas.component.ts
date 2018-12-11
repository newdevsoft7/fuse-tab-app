import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../user.service';
import { ToastrService } from 'ngx-toastr';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-users-profile-workareas',
    templateUrl: './workareas.component.html',
    styleUrls: ['./workareas.component.scss']
})
export class UsersProfileWorkAreasComponent implements OnInit {

    @Input() userInfo;
    @Input() currentUser;
    @Input() settings: any = {};

    workAreas = [];

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private scMessageService: SCMessageService) { }

    ngOnInit() {
        this.getWorkAreas();
    }

    onUpdateWorkArea(workArea) {
        const value = workArea.set ? 1 : 0;
        this.userService.updateProfileWorkArea(this.userInfo.id, workArea.id, value).subscribe(
            res => {
            },
            err => {
                this.scMessageService.error(err);
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
