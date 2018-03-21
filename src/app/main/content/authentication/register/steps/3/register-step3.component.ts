import {
    Component, OnInit,
    ViewEncapsulation, Input
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { RegisterPhotoGalleryDialogComponent } from "./photo-gallery-dialog/photo-gallery-dialog.component";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";

const PROFILE_PHOTO = 'profile_photo';

@Component({
    selector: 'app-register-step3',
    templateUrl: './register-step3.component.html',
    styleUrls: ['./register-step3.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class RegisterStep3Component implements OnInit {

    dialogRef: any;
    photos: any[];
    settings: any = {};

    @Input() user;

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private loadingService: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage
    ) {}

    ngOnInit() {
        this.settings = this.tokenStorage.getSettings() || {};
    }


    showFullImage(photo) {
        this.dialogRef = this.dialog.open(RegisterPhotoGalleryDialogComponent, {
            panelClass: 'register-photo-gallery-dialog',
            data: {
                photos: this.photos,
                photo
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(res => {});
    }

    setPhoto(photo) {
        if (photo.main) {
            return;
        }

        this.userService.setProfilePhoto(this.user.id, photo.id)
            .subscribe(res => {
                const mainPhoto = this.photos.find(v => v.main && v.id != photo.id);
                if (mainPhoto) {
                    mainPhoto.main = 0;
                }
                photo.main = 1;
            }, err => {
                console.log(err);
            })
    }

    private getPhotos() {
        this.userService.getProfilePhotos(this.user.id)
            .subscribe(res => {
                this.photos = res;
            }, err => {
                console.log(err);
            });
    }

    deletePhoto(photo) {
        this.userService.deleteProfileFile(photo.id, PROFILE_PHOTO)
            .subscribe(res => {
                const index = this.photos.findIndex(v => v.id == photo.id);
                this.photos.splice(index, 1);
            }, err => {
                console.log(err);
            });
    }

    onUploadPhoto(event, isAdmin = 0) {
        const files = event.target.files;
        if (files && files.length > 0) {

            this.loadingService.showLoadingSpinner();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('photo[]', files[i], files[i].name);
            }

            this.userService.uploadProfilePhoto(this.user.id, formData)
                .subscribe(res => {
                    this.loadingService.hideLoadingSpinner();
                    this.toastr.success(res.message);
                    res.data.map(photo => {
                        this.photos.push(photo);
                    });
                }, err => {
                    this.loadingService.hideLoadingSpinner();
                    _.forEach(err.error.errors, errors => {
                        _.forEach(errors, (error: string) => {
                            const message = _.replace(error, /photo\.\d+/g, 'photo');
                            this.toastr.error(message);
                        });
                    });
                });
        }
    }
}
