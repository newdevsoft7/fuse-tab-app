import { Component, OnInit, ViewEncapsulation, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37
}

@Component({
    selector: 'app-users-profile-photo-gallery-dialog',
    templateUrl: './photo-gallery-dialog.component.html',
    styleUrls: ['./photo-gallery-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfilePhotoGalleryDialogComponent implements OnInit {

    photos: any[];
    photo;
    index: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit() {
        this.photo = this.data.photo;
        this.photos = this.data.photos;
        this.index = this.photos.findIndex(v => v.id == this.photo.id);
    }

    onPrev() {
        this.index = this.index > 0 ? this.index - 1 : 0;
    }

    onNext() {
        this.index = this.index < this.photos.length - 1 ? this.index + 1 : this.photos.length - 1;
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
