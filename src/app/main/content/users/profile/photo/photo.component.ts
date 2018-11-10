import { Component, OnInit, Input, ViewEncapsulation, DoCheck, IterableDiffers, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatButtonToggleGroup } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

import { UsersProfilePhotoGalleryDialogComponent } from './photo-gallery-dialog/photo-gallery-dialog.component';
import { TagsDialogComponent } from '../dialogs/tags-dialog/tags-dialog.component';
import { HttpEventType } from '@angular/common/http';
import { FuseConfirmYesNoDialogComponent } from '../../../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';

const PROFILE_PHOTO = 'profile_photo';

@Component({
  selector: 'app-users-profile-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersProfilePhotoComponent implements OnInit, DoCheck {

  @Input('userInfo') user;
  @Input() currentUser;
  @Input() settings: any = {};

  @Output() onAvatarChanged = new EventEmitter();
  @ViewChild('group') group: MatButtonToggleGroup;

  photos: any[];
  basicPhotos: any[] = [];
  adminPhotos: any[] = [];
  differ: any;
  tags: string[];
  selectedTags: string[] = [];

  dialogRef: any;

  showProgress: boolean = false;
  progress: number = 0;

  constructor(
    private spinner: CustomLoadingService,
    private dialog: MatDialog,
    private userService: UserService,
    private toastr: ToastrService,
    private scMessageService: SCMessageService,
    differs: IterableDiffers
  ) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.getPhotos();
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

  filterPhotosBySelectedTags(photos: any[]) {
    if (this.selectedTags.length > 0) {
      return photos.filter(p => p.tagged.some(tag => this.selectedTags.indexOf(tag) > -1));
    } else {
      return photos;
    }
  }

  ngDoCheck() {
    const change = this.differ.diff(this.photos);
    if (change) {
      this.basicPhotos = this.photos.filter(photo => +photo.admin_only !== 1);
      this.adminPhotos = this.photos.filter(photo => +photo.admin_only === 1);
    }
  }

  private getPhotos() {
    this.userService.getProfilePhotos(this.user.id)
      .subscribe(res => {
        this.photos = res;
        this.basicPhotos = this.photos.filter(photo => +photo.admin_only !== 1);
        this.adminPhotos = this.photos.filter(photo => +photo.admin_only === 1);
      }, err => {
        console.log(err);
      });
  }

  rotateLeft(photo) {
    this.userService.rotateProfilePhoto(photo.id, 90)
      .subscribe(res => {
        const index = this.photos.findIndex(v => v.id == photo.id);
        this.photos[index] = res.data;
      }, err => {
        console.log(err);
      })
  }

  rotateRight(photo) {
    this.userService.rotateProfilePhoto(photo.id, 270)
      .subscribe(res => {
        const index = this.photos.findIndex(v => v.id == photo.id);
        this.photos[index] = res.data;
      }, err => {
        console.log(err);
      })
  }

  onLockedChanged(photo) {
    const oldVal = photo.locked;
    photo.locked = +oldVal ? '0' : '1';
    this.userService.lockProfilePhoto(photo.id, +photo.locked)
      .subscribe(res => {}, err => {
        photo.locked = oldVal;
        console.log(err);
      });
  }

  onUploadPhoto(event, isAdmin = 0) {
    const files = event.target.files;
    if (files && files.length > 0) {

      let formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('photo[]', files[i], files[i].name);
      }

      if (isAdmin) {
        formData.append('adminOnly', '1');
      }
      this.progress = 0;
      this.showProgress = true;

      this.userService.uploadProfilePhoto(this.user.id, formData)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = event.loaded / event.total * 100;
          } else if (event.type === HttpEventType.Response) {
            this.showProgress = false;
            event.body.data.map(photo => {
              this.photos.push(photo);
            });
          }
        }, err => {
          this.showProgress = false;
          _.forEach(err.error.errors, errors => {
            _.forEach(errors, (error: string) => {
              const message = _.replace(error, /photo\.\d+/g, 'photo');
              this.toastr.error(message);
            });
          });
        });
    }
  }

  showFullImage(photo) {
    this.dialogRef = this.dialog.open(UsersProfilePhotoGalleryDialogComponent, {
      panelClass: 'user-profile-photo-gallery-dialog',
      data: {
        photos: this.photos,
        photo
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(res => {});
  }

  setProfilePhoto(photo) {
    if (+photo.main) {
      this.toastr.info('This photo is already set as main.');
      return;
    }

    const mainPhoto = this.photos.find(v => +v.main && v.id != photo.id);
    if (mainPhoto) {
      mainPhoto.main = '0';
    }
    photo.main = '1';
    this.onAvatarChanged.next(photo.thumbnail);
    this.userService.setProfilePhoto(this.user.id, photo.id)
      .subscribe(res => {}, err => {
        if (mainPhoto) {
          mainPhoto.main = '1';
          this.onAvatarChanged.next(mainPhoto.thumbnail);
        } else {
          this.onAvatarChanged.next(this.getAvatar());
        }
        photo.main = '0';
        console.log(err);
      })
  }

  private getAvatar() {
    if (this.user.ppic_a) {
      return this.user.ppic_a;
    } else {
      switch (this.user.sex) {
        case 'male':
          return `/assets/images/avatars/nopic_male.jpg`;
        case 'female':
          return `/assets/images/avatars/nopic_female.jpg`;
      }
    }
  }

  deleteProfilePhoto(photo) {
    const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = 'Really delete this?';
    dialogRef.afterClosed().subscribe(async result => {
      if (!result) { return; };
      try {
        await this.userService.deleteProfileFile(photo.id, PROFILE_PHOTO).toPromise();
        const index = this.photos.findIndex(v => v.id == photo.id);
        this.photos.splice(index, 1);
        this.getTags();
      } catch (e) {
        this.scMessageService.error(e);
      }
    });
  }

  onDrop(event) {
    const photo = event.value;
    const isDroppedInAdmin = (this.adminPhotos.findIndex(v => v.id == photo.id) > -1) && (+photo.admin_only !== 1);
    const isDroppedInBasic = (this.basicPhotos.findIndex(v => v.id == photo.id) > -1) && (+photo.admin_only === 1);

    if (isDroppedInAdmin || isDroppedInBasic) {
      const adminOnly = isDroppedInAdmin ? 1 : 0;
      this.userService.setProfilePhotoAsAdmin(photo.id, adminOnly)
        .subscribe(res => {
          photo.admin_only = `${adminOnly}`;
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

  openTagModal(photo) {
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      disableClose: false,
      panelClass: 'user-profile-tags-dialog',
      data: {
        tags: photo.tagged,
        source: this.tags
      }
    });
    dialogRef.afterClosed().subscribe(async(tags) => {
      if (tags) {
        try {
          photo.tagged = await this.userService.retags('photo', photo.id, tags);
          this.getTags();
        } catch (e) {}
      }
    });
  }

  getFlooredNumber(num): number {
    return Math.floor(num);
  }

}
