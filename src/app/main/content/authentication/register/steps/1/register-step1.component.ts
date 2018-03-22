import {
    Component, OnInit, OnChanges,
    SimpleChanges, Input
} from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { RegisterService } from "../../register.service";

@Component({
    selector: 'app-register-step1',
    templateUrl: './register-step1.component.html',
    styleUrls: ['./register-step1.component.scss']
})
export class RegisterStep1Component implements OnInit, OnChanges {

    @Input() user: any;

    profile: any = {};

    constructor(
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private userService: UserService,
        private registerService: RegisterService
    ) {}

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user.currentValue) {
            this.userService.getUser(this.user.id)
                .subscribe(res => {
                    this.profile = res;
                });
        }
    }
}
