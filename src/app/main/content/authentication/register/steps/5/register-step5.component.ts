import {
    Component, OnInit,
    ViewEncapsulation, Input, OnChanges,
    Output, EventEmitter, SimpleChanges
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";
import { RegisterService } from "../../register.service";

const PROFILE_DOCUMENT = 'profile_document';

@Component({
    selector: 'app-register-step5',
    templateUrl: './register-step5.component.html',
    styleUrls: ['./register-step5.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterStep5Component implements OnInit, OnChanges {

    documents: any[];
    dialogRef: any;

    @Input() user;
    @Output() quitClicked = new EventEmitter;
    @Output() onStepSucceed = new EventEmitter;

    constructor(
        private userService: UserService,
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private registerService: RegisterService
    ) {}

    ngOnInit() {

    }

    get settings(): any {
        return this.tokenStorage.getSettings() || {};
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user.currentValue) {
            this.getDocuments();
        }
    }

    private getDocuments() {
        this.userService.getProfileDocuments(this.user.id)
            .subscribe(res => {
                this.documents = res;
            }, err => {
                console.log(err);
            });
    }

    async onUploadDocument(event, isAdmin = 0) {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.spinner.show();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('document[]', files[i], files[i].name);
            }

            try {
                const res = await this.userService.uploadProfileDocument(this.user.id, formData).toPromise();
                //this.toastr.success(res.message);
                res.data.map(document => {
                    this.documents.push(document);
                });
            } catch (e) {
                _.forEach(e.error.errors, errors => {
                    _.forEach(errors, (error: string) => {
                        const message = _.replace(error, /document\.\d+/g, 'document');
                        this.toastr.error(message);
                    });
                });
            } finally {
                this.spinner.hide();
            }
        }
    }

    deleteDocument(document) {
        this.userService.deleteProfileFile(document.id, PROFILE_DOCUMENT)
            .subscribe(res => {
                const index = this.documents.findIndex(v => v.id == document.id);
                this.documents.splice(index, 1);
            }, err => {
                console.log(err);
            });
    }

    quit() {
        this.quitClicked.next(true);
    }

    save() {
        this.spinner.show();
        this.registerService.registerByStep('step5', {})
            .subscribe(res => {
                this.spinner.hide();
                //this.toastr.success(res.message);
                if (this.tokenStorage.getRegistrantStep() < 6) {
                    this.tokenStorage.setUser({ ...this.tokenStorage.getUser(), ...{ lvl: 'registrant6' } });
                }
                this.tokenStorage.setSteps(res.steps);
                this.onStepSucceed.next(res.steps);
            }, err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            })
    }
}
