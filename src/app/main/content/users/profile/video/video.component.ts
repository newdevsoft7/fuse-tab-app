import { Component, OnInit, ViewEncapsulation, Input, DoCheck, IterableDiffers } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

import { UsersProfileVideoGalleryDialogComponent } from './video-gallery-dialog/video-gallery-dialog.component';

const PROFILE_VIDEO = 'profile_video';


@Component({
    selector: 'app-users-profile-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileVideoComponent implements OnInit, DoCheck {

    @Input('userInfo') user;
    @Input() currentUser;

    videos: any[];
    basicVideos: any[];
    adminVideos: any[];

    differ: any;

    dialogRef: any;

    constructor(
        private loadingService: CustomLoadingService,
        private dialog: MatDialog,
        private userService: UserService,
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {
        this.getVideos();
    }

    ngDoCheck() {
        const change = this.differ.diff(this.videos);
        if (change) {
            this.basicVideos = this.videos.filter(video => video.admin_only != 1);
            this.adminVideos = this.videos.filter(video => video.admin_only == 1);
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

    onLockedChanged(video) {
        const lock = video.locked ? 0 : 1;
        this.userService.lockProfileVideo(video.id, lock)
            .subscribe(res => {
                video.locked = video.locked ? 0 : 1;
            }, err => {
                console.log(err);
            });
    }

    showVideo(video) {
        this.dialogRef = this.dialog.open(UsersProfileVideoGalleryDialogComponent, {
            panelClass: 'user-profile-video-gallery-dialog',
            data: {
                videos: this.videos,
                video
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(res => { });
    }

    deleteProfileVideo(video) {
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
            this.loadingService.showLoadingSpinner();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('video[]', files[i], files[i].name);
            }

            if (isAdmin) {
                formData.append('adminOnly', '1');
            }

            this.userService.uploadProfileVideo(this.user.id, formData)
                .subscribe(res => {
                    this.toastr.success(res.message);
                    this.loadingService.hideLoadingSpinner();
                    res.data.map(video => {
                        this.videos.push(video);
                    });
                }, err => {
                    this.loadingService.hideLoadingSpinner();
                    _.forEach(err.error.errors, errors => {
                        _.forEach(errors, (error: string) => {
                            const message = _.replace(error, /video\.\d+/g, 'video');
                            this.toastr.error(message);
                        });
                    });
                });
        }
    }

    onDrop(event) {
        const video = event.value;
        const isDroppedInAdmin = (this.adminVideos.findIndex(v => v.id == video.id) > -1) && (video.admin_only != 1);
        const isDroppedInBasic = (this.basicVideos.findIndex(v => v.id == video.id) > -1) && (video.admin_only == 1);

        if (isDroppedInAdmin || isDroppedInBasic) {
            const adminOnly = isDroppedInAdmin ? 1 : 0;
            this.userService.setProfileVideoAsAdmin(video.id, adminOnly)
                .subscribe(res => {
                    video.admin_only = adminOnly;
                }, err => {
                    console.log(err);
                });
        }
    }

    get isOwner() {
        return this.currentUser.lvl == 'owner';
    }

    get isAdmin() {
        return this.currentUser.lvl == 'admin';
    }


}
