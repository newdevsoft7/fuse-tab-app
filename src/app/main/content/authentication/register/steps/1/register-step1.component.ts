import {
    Component, OnInit, OnChanges,
    SimpleChanges, Input, Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    AfterViewChecked
} from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { RegisterService } from "../../register.service";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";

@Component({
    selector: 'app-register-step1',
    templateUrl: './register-step1.component.html',
    styleUrls: ['./register-step1.component.scss']
})
export class RegisterStep1Component implements OnInit, OnChanges, AfterViewChecked {

    @Input() user: any;
    @Output() quitClicked = new EventEmitter;
    @Output() onStepSucceed = new EventEmitter;
    @ViewChildren('tag') tags: QueryList<any>;
    prevOpenedField: any;

    profile: any;

    sex: string;

    constructor(
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private userService: UserService,
        private tokenStorage: TokenStorage,
        private registerService: RegisterService
    ) {}

    get message(): string {
        return this.tokenStorage.getSettings()? this.tokenStorage.getSettings().profile_info_message : '';
    }

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

    ngAfterViewChecked() {
        const openedFields = this.tags.filter(v => v.formActive);
        switch (openedFields.length) {
            case 0:
                break;
            case 1:
                setTimeout(() => this.prevOpenedField = openedFields[0]);
                break;
            case 2:
                setTimeout(() => this.prevOpenedField.onFormSubmit());
                break;
        }
    }

    quit() {
        this.quitClicked.next(true);
    }

    updateSex(sex: string) {
        setTimeout(() => {
            this.sex = sex;
        });
    }

    save() {
        this.spinner.show();
        this.registerService.registerByStep('step1', {})
            .subscribe(res => {
                this.spinner.hide();
                //this.toastr.success(res.message);
                if (this.tokenStorage.getRegistrantStep() < 2) {
                    this.tokenStorage.setUser({ ...this.user, ...{ lvl: 'registrant2' } });
                }
                this.tokenStorage.setSteps(res.steps);
                this.onStepSucceed.next(res.steps);
            }, err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            })
    }

}
