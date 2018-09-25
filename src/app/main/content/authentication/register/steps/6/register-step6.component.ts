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
import { HttpEvent, HttpEventType } from '@angular/common/http';

const PROFILE_VIDEO = 'profile_video';

@Component({
    selector: 'app-register-step6',
    templateUrl: './register-step6.component.html',
    styleUrls: ['./register-step6.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterStep6Component implements OnInit, OnChanges {

    videos: any[];
    dialogRef: any;

    @Input() user;
    @Output() quitClicked = new EventEmitter;
    @Output() onStepSucceed = new EventEmitter;

    fileDetails: any;
    showProgress: boolean = false;
    progress: number = 0;

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private registerService: RegisterService
    ) { }

    ngOnInit() {

    }

    get settings(): any {
        return this.tokenStorage.getSettings() || {};
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user.currentValue) {
            this.getVideos();
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
        const files = (event.target.files || []) as File[];
        const largeFiles = [], normalFiles = [];
        for (const file of files) {
            if (file.type !== 'video/mp4') continue;
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
                    this.showProgress = false;
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
        this.registerService.registerByStep('step6', {})
            .subscribe(res => {
                this.spinner.hide();
                //this.toastr.success(res.message);
                if (this.tokenStorage.getRegistrantStep() < 7) {
                    this.tokenStorage.setUser({ ...this.tokenStorage.getUser(), ...{ lvl: 'registrant7' } });
                }
                this.tokenStorage.setSteps(res.steps);
                this.onStepSucceed.next(res.steps);
            }, err => {
                this.spinner.hide();
                this.toastr.error(err.error.message);
            })
    }

    getFlooredNumber(num): number {
        return Math.floor(num);
    }

}
