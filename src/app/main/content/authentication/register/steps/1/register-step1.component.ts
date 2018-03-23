import {
    Component, OnInit, OnChanges,
    SimpleChanges, Input, Output,
    EventEmitter
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
    @Output() quitClicked = new EventEmitter;
    @Output() onStepSucceed = new EventEmitter;

    profile: any;

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

    quit() {
        this.quitClicked.next(true);
    }

    save() {
        this.spinner.show();
        this.registerService.registerByStep('step1', {})
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