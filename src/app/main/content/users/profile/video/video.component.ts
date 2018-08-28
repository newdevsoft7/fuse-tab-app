import { Component, OnInit, ViewEncapsulation, Input, DoCheck, IterableDiffers } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

import { UsersProfileVideoGalleryDialogComponent } from './video-gallery-dialog/video-gallery-dialog.component';
import { TagsDialogComponent } from '../dialogs/tags-dialog/tags-dialog.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import 'rxjs/add/operator/map';

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
    @Input() settings: any = {};

    videos: any[];
    basicVideos: any[] = [];
    adminVideos: any[] = [];

    differ: any;
	tags: string[];
	selectedTags: string[] = [];

    dialogRef: any;
    fileDetails: any;

    showProgress: boolean = false;
    progress: number = 0;

    constructor(
        private spinner: CustomLoadingService,
        private dialog: MatDialog,
        private userService: UserService,
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {
        this.getVideos();
        this.getTags();
    }

    async getTags() {
		try {
			this.tags = await this.userService.getTags('photo');
			if (this.selectedTags.length > 0) {
				this.selectedTags = this.selectedTags.filter(tag => this.tags.indexOf(tag) > -1);
			}
		} catch (e) { }
    }
    
    toggleSelect(tag) {
		const index = this.selectedTags.findIndex(s => s.toLowerCase() == tag.toLowerCase());
		if (index < 0) {
			this.selectedTags.push(tag);
		} else {
			this.selectedTags.splice(index, 1);
		}
    }
    
    filterVideosBySelectedTags(videos: any[]) {
		if (this.selectedTags.length > 0) {
			return videos.filter(v => v.tagged.some(tag => this.selectedTags.indexOf(tag) > -1));
		} else {
			return videos;
		}
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
                this.getTags();
            }, err => {
                console.log(err);
            });
    }

    onUploadVideo(event, isAdmin = 0) {
        const files = event.target.files || [];
        const largeFiles = [], normalFiles = [];
        for (const file of files) {
            if (file.size > 10485760) {
                largeFiles.push(file);
            } else {
                normalFiles.push(file);
            }
        }
        if (normalFiles.length > 0) {

            let formData = new FormData();

            for (let i = 0; i < normalFiles.length; i++) {
                formData.append('video[]', normalFiles[i], normalFiles[i].name);
            }

            if (isAdmin) {
                formData.append('adminOnly', '1');
            }

            this.showProgress = true;

            this.userService.uploadProfileVideo(this.user.id, formData)
                .subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = event.loaded / event.total * 100;
                    } else if (event.type === HttpEventType.Response) {
                        this.showProgress = false;
                        event.body.data.map(video => {
                            this.videos.push(video);
                        });
                    }
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
        if (largeFiles.length > 0) {
            this.uploadLargeFiles(largeFiles, isAdmin);
        }
    }

    private async uploadLargeFiles(files, isAdmin) {
        this.fileDetails = {};

        for (const file of files) {
            this.fileDetails[file.name] = {};
            this.fileDetails[file.name].file = file;
            this.fileDetails[file.name].endByte = 0;
            this.fileDetails[file.name].part = 0;
            this.fileDetails[file.name].isLastPart = false;

            this.showProgress = true;
            await this.getPartSize(file, isAdmin);
        }
    }

    private async getPartSize(file, isAdmin) {
        this.fileDetails[file.name].startByte = this.fileDetails[file.name].endByte;
        this.fileDetails[file.name].endByte = this.fileDetails[file.name].endByte + 10485760;
        this.fileDetails[file.name].part++;
        if (this.fileDetails[file.name].endByte >= file.size) {
            this.fileDetails[file.name].endByte = file.size;
            this.fileDetails[file.name].isLastPart = true;
        }
        this.fileDetails[file.name].startOffset = this.fileDetails[file.name].startByte;
        this.fileDetails[file.name].endOffset = this.fileDetails[file.name].endByte;
        const chunkFile = this.fileDetails[file.name].file.slice(this.fileDetails[file.name].startByte, this.fileDetails[file.name].endByte);

        let formData = new FormData();
        formData.append('video', chunkFile);
        if (isAdmin) {
            formData.append('adminOnly', '1');
        }
        formData.append('part', this.fileDetails[file.name].part);
        formData.append('isLastPart', this.fileDetails[file.name].isLastPart);
        const event = await this.userService.uploadProfileVideo(this.user.id, formData, true).map(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progress = this.fileDetails[file.name].startByte / file.size * 100 + (this.fileDetails[file.name].endByte - this.fileDetails[file.name].startByte) / file.size * (event.loaded / event.total) * 100;
            }
            return event;
        }).toPromise();
        const data = event.body.data;
        if (data.processing) {
            await this.getPartSize(file, isAdmin);
        } else {
            delete data.processing;
            this.videos.push(data);
            this.showProgress = false;
            this.progress = 0;
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

    openTagModal(video) {
		const dialogRef = this.dialog.open(TagsDialogComponent, {
			disableClose: false,
			panelClass: 'user-profile-tags-dialog',
			data: {
				tags: video.tagged,
				source: this.tags
			}
		});
		dialogRef.afterClosed().subscribe(async(tags) => {
			if (tags) {
				try {
					video.tagged = await this.userService.retags('video', video.id, tags);
					this.getTags();
				} catch (e) {}
			}
		});
    }
    
    getFlooredNumber(num): number {
        return Math.floor(num);
    }
}
