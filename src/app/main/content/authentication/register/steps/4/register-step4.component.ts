import {
    Component, OnInit,
    ViewEncapsulation, Input
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";

const PROFILE_DOCUMENT = 'profile_document';

@Component({
    selector: 'app-register-step4',
    templateUrl: './register-step4.component.html',
    styleUrls: ['./register-step4.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterStep4Component implements OnInit {

    settings: any = {};
    documents: any[];
    dialogRef: any;
    @Input() user;

    constructor(
        private userService: UserService,
        private loadingService: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage
    ) {}

    ngOnInit() {
        this.settings = this.tokenStorage.getSettings() || {};
    }

    private getDocuments() {
        this.userService.getProfileDocuments(this.user.id)
            .subscribe(res => {
                this.documents = res;
            }, err => {
                console.log(err);
            });
    }

    onUploadDocument(event, isAdmin = 0) {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.loadingService.showLoadingSpinner();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('document[]', files[i], files[i].name);
            }

            this.userService.uploadProfileDocument(this.user.id, formData)
                .subscribe(res => {
                    this.loadingService.hideLoadingSpinner();
                    this.toastr.success(res.message);
                    res.data.map(document => {
                        this.documents.push(document);
                    });
                }, err => {
                    this.loadingService.hideLoadingSpinner();
                    _.forEach(err.error.errors, errors => {
                        _.forEach(errors, (error: string) => {
                            const message = _.replace(error, /document\.\d+/g, 'document');
                            this.toastr.error(message);
                        });
                    });
                });
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
}
