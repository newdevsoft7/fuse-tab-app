import { Component, OnInit, ViewEncapsulation, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37
}

@Component({
    selector: 'app-users-profile-video-gallery-dialog',
    templateUrl: './video-gallery-dialog.component.html',
    styleUrls: ['./video-gallery-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileVideoGalleryDialogComponent implements OnInit {

    videos: any[];
    video;
    index: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit() {
        this.video = this.data.video;
        this.videos = this.data.videos;
        this.index = this.videos.findIndex(v => v.id == this.video.id);
    }

    onPrev() {
        this.index = this.index > 0 ? this.index - 1 : 0;
    }

    onNext() {
        this.index = this.index < this.videos.length - 1 ? this.index + 1 : this.videos.length - 1;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {

        if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            this.onNext();
        }

        if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.onPrev();
        }
    }

}
