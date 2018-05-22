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
    selector: 'app-register-step7',
    templateUrl: './register-step7.component.html',
    styleUrls: ['./register-step7.component.scss']
})
export class RegisterStep7Component implements OnInit, OnChanges {

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

    }

    get settings(): any {
        return this.tokenStorage.getSettings() || {};
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
        this.registerService.registerByStep('step7', {})
            .subscribe(res => {
                this.spinner.hide();
                this.toastr.success(res.message);
                if (this.tokenStorage.getRegistrantStep() < 8) {
                    this.tokenStorage.setUser({ ...this.tokenStorage.getUser(), ...{ lvl: 'registrant8' } });
                }
                this.tokenStorage.setSteps(res.steps);
                this.onStepSucceed.next(res.steps);
            }, err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            })
    }
}
