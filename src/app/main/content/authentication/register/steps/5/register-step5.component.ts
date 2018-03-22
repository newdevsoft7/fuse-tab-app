import {
    Component, OnInit,
    ViewEncapsulation, Input,
    SimpleChanges, Output,
    EventEmitter, OnChanges
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import * as _ from 'lodash';

import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { UserService } from "../../../../users/user.service";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";

import { RegisterVideoGalleryDialogComponent } from './video-gallery-dialog/video-gallery-dialog.component';
import { RegisterService } from "../../register.service";

const PROFILE_VIDEO = 'profile_video';

@Component({
    selector: 'app-register-step5',
    templateUrl: './register-step5.component.html',
    styleUrls: ['./register-step5.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterStep5Component implements OnInit, OnChanges {

    settings: any = {};
    videos: any[];
    dialogRef: any;

    @Input() user;
    @Output() quitClicked = new EventEmitter;
    @Output() onStepSucceed = new EventEmitter;

    constructor(
        private dialog: MatDialog,
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
            this.userService.getUser(this.user.id)
                .subscribe(res => {
                    this.getVideos();
                });
        }
    }

    showVideo(video) {
        this.dialogRef = this.dialog.open(RegisterVideoGalleryDialogComponent, {
            panelClass: 'register-video-gallery-dialog',
            data: {
                videos: this.videos,
                video
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(res => { });
    }

    deleteVideo(video) {
        this.userService.deleteProfileFile(video.id, PROFILE_VIDEO)
            .subscribe(res => {
                const index = this.videos.findIndex(v => v.id == video.id);
                this.videos.splice(index, 1);
            }, err => {
                console.log(err);
            });
    }

    onUploadVideo(event, isAdmin = 0) {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.spinner.show();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('video[]', files[i], files[i].name);
            }


            this.userService.uploadProfileVideo(this.user.id, formData)
                .subscribe(res => {
                    this.toastr.success(res.message);
                    this.spinner.hide();
                    res.data.map(video => {
                        this.videos.push(video);
                    });
                }, err => {
                    this.spinner.hide();
                    _.forEach(err.error.errors, errors => {
                        _.forEach(errors, (error: string) => {
                            const message = _.replace(error, /video\.\d+/g, 'video');
                            this.toastr.error(message);
                        });
                    });
                });
        }
    }

    private getVideos() {
        this.userService.getProfileVideos(this.user.id)
            .subscribe(res => {
                this.videos = res;
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
                this.toastr.success(res.message);
                this.onStepSucceed.next(res.steps);
            }, err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            })
    }

}
