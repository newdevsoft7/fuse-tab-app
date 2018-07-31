import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../../tab/tab.service';
import { UserService } from '../../user.service';
import { ProfileCardsVideoGalleryDialogComponent } from './dialogs/video-gallery-dialog/video-gallery-dialog.component';
import { ProfileCardsPhotoGalleryDialogComponent } from './dialogs/photo-gallery-dialog/photo-gallery-dialog.component';
import { ShowcaseService } from '../../../showcase/showcase.service';
import { Tab } from '../../../../tab/tab';

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
    template: any;

    constructor(
        private toastr: ToastrService,
        private tabService: TabService,
        private userService: UserService,
        private showcaseService: ShowcaseService,
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
            const res = await this.showcaseService.getTemplateByOtherId(this.cardData.other_id);
            this.template = res.data;
        } catch (e) {
            this.displayError(e);
        }
    }

    toggleDrawer() {
        this.drawer.toggle();
    }

    view () {
        if (!this.template) return;
        const tab = new Tab(
            this.template.name,
            'showcaseTpl',
            `showcase/card/${this.selectedCard.id}/templates/${this.template.other_id}/view`,
            {
                name: this.template.name,
                payload: this.cardData,
                type: 'card',
                template_id: this.template.other_id
            }
        );
        this.tabService.openTab(tab);
    }

    showVideo(video) {
        const dialogRef = this.dialog.open(ProfileCardsVideoGalleryDialogComponent, {
            panelClass: 'profile-cards-video-gallery-dialog',
            disableClose: false,
            data: {
                videos: this.cardData.videos,
                video
            }
        });

        dialogRef.afterClosed().subscribe(res => { });
    }

    showPhoto(photo) {
        const dialogRef = this.dialog.open(ProfileCardsPhotoGalleryDialogComponent, {
            panelClass: 'profile-cards-photo-gallery-dialog',
            disableClose: false,
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
