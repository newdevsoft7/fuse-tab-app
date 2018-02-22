import { Component, OnInit, Input, ViewEncapsulation, DoCheck, IterableDiffers, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { UserService } from '../../user.service';

import * as _ from 'lodash';

import { UsersProfilePhotoGalleryDialogComponent } from './photo-gallery-dialog/photo-gallery-dialog.component';

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

	@Output() onAvatarChanged = new EventEmitter();

	photos: any[];
	basicPhotos: any[];
	adminPhotos: any[];
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
		this.getPhotos();
	}

	ngDoCheck() {
		const change = this.differ.diff(this.photos);
		if (change) {
			this.basicPhotos = this.photos.filter(photo => photo.admin_only != 1);
			this.adminPhotos = this.photos.filter(photo => photo.admin_only == 1);
		}
	}

	private getPhotos() {
		this.userService.getProfilePhotos(this.user.id)
			.subscribe(res => {
				this.photos = res;
				this.basicPhotos = this.photos.filter(photo => photo.admin_only != 1);
				this.adminPhotos = this.photos.filter(photo => photo.admin_only == 1);
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
		const lock = photo.locked ? 0 : 1;
		this.userService.lockProfilePhoto(photo.id, lock)
			.subscribe(res => {
				photo.locked = photo.locked ? 0 : 1;
			}, err => {
				console.log(err);
			});
	}

	onUploadPhoto(event, isAdmin = 0) {
		const files = event.target.files;
		if (files && files.length > 0) {

			this.loadingService.showLoadingSpinner();

			let formData = new FormData();

			for (let i = 0; i < files.length; i++) {
				formData.append('photo[]', files[i], files[i].name);
			}

			if (isAdmin) {
				formData.append('adminOnly', '1');
			}

			this.userService.uploadProfilePhoto(this.user.id, formData)
				.subscribe(res => {
					this.loadingService.hideLoadingSpinner();
					this.toastr.success(res.message);
					res.data.map(photo => {
						this.photos.push(photo);
					});
				}, err => {
					this.loadingService.hideLoadingSpinner();
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
		if (photo.main) {
			return;
		}

		this.userService.setProfilePhoto(this.user.id, photo.id)
			.subscribe(res => {
				const mainPhoto = this.photos.find(v => v.main && v.id != photo.id);
				if (mainPhoto) {
					mainPhoto.main = 0;
				}
				photo.main = 1;
				this.onAvatarChanged.next(photo.thumbnail);
			}, err => {
				console.log(err);
			})
	}

	deleteProfilePhoto(photo) {
		this.userService.deleteProfileFile(photo.id, PROFILE_PHOTO)
			.subscribe(res => {
				const index = this.photos.findIndex(v => v.id == photo.id);
				this.photos.splice(index, 1);
			}, err => {
				console.log(err);
			});
	}

	onDrop(event) {
		const photo = event.value;
		const isDroppedInAdmin = (this.adminPhotos.findIndex(v => v.id == photo.id) > -1) && (photo.admin_only != 1);
		const isDroppedInBasic = (this.basicPhotos.findIndex(v => v.id == photo.id) > -1) && (photo.admin_only == 1);
		
		if (isDroppedInAdmin || isDroppedInBasic) {
			const adminOnly = isDroppedInAdmin ? 1 : 0;
			this.userService.setProfilePhotoAsAdmin(photo.id, adminOnly)
				.subscribe(res => {
					photo.admin_only = adminOnly;
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
