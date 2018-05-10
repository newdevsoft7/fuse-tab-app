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
export class RegisterStep7Component {

    settings: any = {};
    @Output() quitClicked = new EventEmitter;

    constructor(
        private userService: UserService,
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private registerService: RegisterService
    ) {}

    ngOnInit() {
        this.settings = this.tokenStorage.getSettings() || {};
    }

    quit() {
        this.quitClicked.next(true);
    }
}
