import { Component, OnInit, Input, ViewEncapsulation, DoCheck, IterableDiffers, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { UserService } from '../../user.service';
import * as _ from 'lodash';

const PROFILE_DOCUMENT = 'profile_document';

@Component({
	selector: 'app-users-profile-document',
	templateUrl: './document.component.html',
	styleUrls: ['./document.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UsersProfileDocumentComponent implements OnInit, DoCheck {

	@Input('userInfo') user;
	@Input() currentUser;

	documents: any[];
	basicDocuments: any[];
	adminDocuments: any[];
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
		this.getDocuments();
	}

	ngDoCheck() {
		const change = this.differ.diff(this.documents);
		if (change) {
			this.basicDocuments = this.documents.filter(photo => photo.admin_only != 1);
			this.adminDocuments = this.documents.filter(photo => photo.admin_only == 1);
		}
	}

	private getDocuments() {
		this.userService.getProfileDocuments(this.user.id)
			.subscribe(res => {
				this.documents = res;
				this.basicDocuments = this.documents.filter(document => document.admin_only != 1);
				this.adminDocuments = this.documents.filter(document => document.admin_only == 1);
			}, err => {
				console.log(err);
			});
	}

	
	onLockedChanged(document) {
		const lock = document.locked ? 0 : 1;
		this.userService.lockProfileDocument(document.id, lock)
			.subscribe(res => {
				document.locked = document.locked ? 0 : 1;
			}, err => {
				console.log(err);
			});
	}

	onUploadDocument(event, isAdmin = 0) {
		const files = event.target.files;
		if (files && files.length > 0) {
			this.loadingService.showLoadingSpinner();

			let formData = new FormData();

			for (let i = 0; i < files.length; i++) {
				formData.append('document[]', files[i], files[i].name);
			}

			if (isAdmin) {
				formData.append('adminOnly', '1');
			}

			this.userService.uploadProfileDocument(this.user.id, formData)
				.subscribe(res => {
					this.loadingService.hideLoadingSpinner();
					this.toastr.success(res.message);
					res.data.map(document => {
						this.documents.push(document);
					});
				}, err => {
					this.loadingService.hideLoadingSpinner();
					_.forEach(err.error.errors, errors => {
						_.forEach(errors, (error: string) => {
							const message = _.replace(error, /document\.\d+/g, 'document');
							this.toastr.error(message);
						});
					});
				});
		}
	}

	deleteProfileDocument(document) {
		this.userService.deleteProfileFile(document.id, PROFILE_DOCUMENT)
			.subscribe(res => {
				const index = this.documents.findIndex(v => v.id == document.id);
				this.documents.splice(index, 1);
			}, err => {
				console.log(err);
			});
	}

	onDrop(event) {
		const document = event.value;
		const isDroppedInAdmin = (this.adminDocuments.findIndex(v => v.id == document.id) > -1) && (document.admin_only != 1);
		const isDroppedInBasic = (this.basicDocuments.findIndex(v => v.id == document.id) > -1) && (document.admin_only == 1);
		
		if (isDroppedInAdmin || isDroppedInBasic) {
			const adminOnly = isDroppedInAdmin ? 1 : 0;
			this.userService.setProfileDocumentAsAdmin(document.id, adminOnly)
				.subscribe(res => {
					document.admin_only = adminOnly;
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
