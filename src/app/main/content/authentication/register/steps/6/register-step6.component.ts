import {
    Component, OnInit,
    Input, OnChanges,
    Output, EventEmitter,
    SimpleChanges
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";
import { RegisterService } from "../../register.service";

@Component({
    selector: 'app-register-step6',
    templateUrl: './register-step6.component.html',
    styleUrls: ['./register-step6.component.scss']
})
export class RegisterStep6Component implements OnInit, OnChanges {

    settings: any = {};
    workAreas = [];

    @Input() user;
    @Output() quitClicked = new EventEmitter;
    @Output() onStepSucceed = new EventEmitter;

    constructor(
        private userService: UserService,
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private registerService: RegisterService
    ) { }

    ngOnInit() {
        this.settings = this.tokenStorage.getSettings() || {};
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user.currentValue) {
            this.getWorkAreas();
        }
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

    quit() {
        this.quitClicked.next(true);
    }

    save() {
        this.spinner.show();
        this.registerService.registerByStep('step6', {})
            .subscribe(res => {
                this.spinner.hide();
                this.toastr.success(res.message);
                this.onStepSucceed.next(res.steps);
            }, err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            })
    }
}
