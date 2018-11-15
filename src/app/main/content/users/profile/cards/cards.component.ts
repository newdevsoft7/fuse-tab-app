import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDrawer, MatDialog } from '@angular/material';
import { UserService } from '../../user.service';
import { ProfileCardsVideoGalleryDialogComponent } from './dialogs/video-gallery-dialog/video-gallery-dialog.component';
import { ProfileCardsPhotoGalleryDialogComponent } from './dialogs/photo-gallery-dialog/photo-gallery-dialog.component';
import { ShowcaseService } from '../../../showcase/showcase.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';
import { Subscription } from 'rxjs/Subscription';
import { ObservableMedia } from '@angular/flex-layout';
import { FuseMatchMedia } from '../../../../../core/services/match-media.service';

@Component({
  selector: 'app-users-profile-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class UsersProfileCardsComponent implements OnInit, OnDestroy {

  @Input('userInfo') user;
  @Input() currentUser;
  @Input() settings: any = {};

  @ViewChild('drawer') drawer: MatDrawer;

  cards: any[] = [];
  cardData: any = null;
  selectedCard: any = null;
  template: any;
  matchMediaSubscription: Subscription;
  drawerMode = 'side';

  constructor(
    private userService: UserService,
    private showcaseService: ShowcaseService,
    private scMessageService: SCMessageService,
    private dialog: MatDialog,
    private observableMedia: ObservableMedia,
    private fuseMatchMedia: FuseMatchMedia
  ) { }

  ngOnInit() {
    this.getCards();

    if (this.observableMedia.isActive('gt-sm')) {
      this.drawerMode = 'side';
      this.drawer.toggle(true);
    } else {
      this.drawerMode = 'over';
      this.drawer.toggle(false);
    }

    this.matchMediaSubscription = this.fuseMatchMedia.onMediaChange.subscribe(() => {
      if (this.observableMedia.isActive('gt-sm')){
        this.drawerMode = 'side';
        this.drawer.toggle(true);
      } else {
        this.drawerMode = 'over';
        this.drawer.toggle(false);
      }
    });

  }

  ngOnDestroy() {
    this.matchMediaSubscription.unsubscribe();
  }

  async getCards() {
    try {
      this.cards = await this.userService.getCards();
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async selectCard(card) {
    this.selectedCard = card;
    try {
      this.cardData = await this.userService.getUserCard(this.user.id, card.id);
      const res = await this.showcaseService.getTemplateByOtherId(this.cardData.other_id);
      this.template = res.data;
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  toggleDrawer() {
    this.drawer.toggle();
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

    dialogRef.afterClosed().subscribe(() => { });
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

    dialogRef.afterClosed().subscribe(() => { });
  }

}
