import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../../tab/tab.service';
import { UserService } from '../../user.service';
import { ProfileCardsVideoGalleryDialogComponent } from './dialogs/video-gallery-dialog/video-gallery-dialog.component';
import { ProfileCardsPhotoGalleryDialogComponent } from './dialogs/photo-gallery-dialog/photo-gallery-dialog.component';

@Component({
    selector: 'app-users-profile-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss']
})
export class UsersProfileCardsComponent implements OnInit {

    @Input('userInfo') user;
    @Input() currentUser;
    @Input() settings: any = {};

    @ViewChild('drawer') drawer: MatDrawer;

    cards: any[] = [];
    cardData: any = null;
    selectedCard: any = null;

    constructor(
        private toastr: ToastrService,
        private tabService: TabService,
        private userService: UserService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.getCards();
    }

    async getCards() {
        try {
            this.cards = await this.userService.getCards();
        } catch (e) {
            this.displayError(e);
        }
    }

    async selectCard(card) {
        this.selectedCard = card;
        try {
            this.cardData = await this.userService.getUserCard(this.user.id, card.id);
        } catch (e) {
            this.displayError(e);
        }
    }

    toggleDrawer() {
        this.drawer.toggle();
    }

    view() {
    }

    showVideo(video) {
        const dialogRef = this.dialog.open(ProfileCardsVideoGalleryDialogComponent, {
            panelClass: 'profile-cards-video-gallery-dialog',
            data: {
                videos: this.cardData.videos,
                video
            }
        });

        dialogRef.afterClosed().subscribe(res => { });
    }

    showPhoto(photo) {
        const dialogRef = this.dialog.open(ProfileCardsPhotoGalleryDialogComponent, {
            panelClass: 'profile-cards-photo-gallery-dialog ',
            data: {
                photos: this.cardData.photos,
                photo
            }
        });

        dialogRef.afterClosed().subscribe(res => { });
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }

}
