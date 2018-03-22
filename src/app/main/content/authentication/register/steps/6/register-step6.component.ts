import {
    Component, OnInit,
    Input
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";

@Component({
    selector: 'app-register-step6',
    templateUrl: './register-step6.component.html',
    styleUrls: ['./register-step6.component.scss']
})
export class RegisterStep6Component implements OnInit {

    settings: any = {};
    @Input() user;
    workAreas = [];

    constructor(
        private userService: UserService,
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage
    ) { }

    ngOnInit() {
        this.settings = this.tokenStorage.getSettings() || {};
    }

    onUpdateWorkArea(workArea) {
        const value = workArea.set ? 1 : 0;
        this.userService.updateProfileWorkArea(this.user.id, workArea.id, value).subscribe(
            res => {
                this.toastr.success(res.message);
            },
            err => {
                console.log(err);
            }
        );
    }

    private getWorkAreas() {
        this.userService.getProfileWorkAreas(this.user.id).subscribe(
            res => {
                this.workAreas = res;
            },
            err => {
                console.log(err);
            }
        );
    }
}
