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
    selector: 'app-register-step2',
    templateUrl: './register-step2.component.html',
    styleUrls: ['./register-step2.component.scss']
})
export class RegisterStep2Component implements OnInit, OnChanges {

    settings: any = {};
    attributes = [];

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
            this.getAttributes();
        }
    }

    onUpdateAttribute(attr) {
        const value = attr.set ? 1 : 0;
        this.userService.updateProfileAttribute(this.user.id, attr.id, value).subscribe(
            res => {
                this.toastr.success(res.message);
            },
            err => {
                console.log(err);
            }
        );
    }

    private getAttributes() {
        this.userService.getProfileAttributes(this.user.id).subscribe(
            res => {
                this.attributes = res;
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
        this.registerService.registerByStep('step2', {})
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
