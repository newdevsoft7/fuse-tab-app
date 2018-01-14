import {
	Component,
	OnInit,
	ViewEncapsulation
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

import { ProfileInfoService } from './profile-info.service';
import { ProfileField } from '../profile-field.model';
import { ProfileInfoCategoryDialogComponent } from './dialogs/category/category.component';
import { ProfileInfoElementDialogComponent } from './dialogs/element/element.component';
import { ProfileInfoEditElementOptionsDialogComponent } from './dialogs/edit-element-options/edit-element-options.component';

@Component({
	selector: 'app-profile-info',
	templateUrl: './profile-info.component.html',
	styleUrls: ['./profile-info.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {

	profileFields: any[] = [];
	dialogRef: any;
	confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

	constructor(
		private profileInfoService: ProfileInfoService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.profileInfoService.getFields()
			.subscribe(
				res => {
					this.profileFields = [ ...res ];
				},
				(err) => {
					console.log(err);
				}
			);
	}

	print() {
		console.log(this.profileFields);
	}

	onDrop(evt) {
		let node: ProfileField = evt.value;
		const parent = this.findParent(node, this.profileFields);
		node.profile_category_id = parent == this.profileFields ? null : (parent as ProfileField).id
	}

	click(model, evt) {
		evt.stopPropagation();
	}

	onEditCategory(category) {
		this.dialogRef = this.dialog.open(ProfileInfoCategoryDialogComponent, {
			panelClass: 'profile-info-category-dialog',
			data: {
				category: category,
				isCreate: false
			}
		});
		this.dialogRef.afterClosed()
			.subscribe((modifiedCategory: ProfileField) => {
				if (modifiedCategory) {
					category.cname = modifiedCategory.cname;
				}
			});
	}

	onAddCategory(category) {
		this.dialogRef = this.dialog.open(ProfileInfoCategoryDialogComponent, {
			panelClass: 'profile-info-category-dialog',
			data: {
				category: new ProfileField({}),
				isCreate: true
			}
		});
		this.dialogRef.afterClosed()
			.subscribe((newCategory: ProfileField) => {
				if (newCategory) {
					if (category) {
						newCategory.profile_category_id = category.id;
						if (!category.elements) category.elements = [];
						category.elements.push(newCategory);
					} else {
						newCategory.profile_category_id = null;
						this.profileFields.push(newCategory);
					}
				}
			});
	}

	onAddField(category) {
		this.dialogRef = this.dialog.open(ProfileInfoElementDialogComponent, {
			panelClass: 'profile-info-field-dialog',
			data: {
				field: new ProfileField({})
			}
		});
		this.dialogRef.afterClosed()
			.subscribe((newField: ProfileField) => {
				if (newField) {
					if (category) {
						newField.profile_category_id = category.id;
						if (!category.elements) category.elements = [];
						category.elements.push(newField);
					} else {
						newField.profile_category_id = null;
						this.profileFields.push(newField);
					}
				}
			});
	}

	onEditFieldOptions(field) {
		this.dialogRef = this.dialog.open(ProfileInfoEditElementOptionsDialogComponent, {
			panelClass: 'profile-info-edit-field-options-dialog',
			data: {
				field
			}
		});
		this.dialogRef.afterClosed()
			.subscribe((modifiedField: ProfileField) => {
				if (modifiedField) {
					field.filter = modifiedField.filter;
					field.options = modifiedField.options;
				}
			});
	}

	onCategoryAdd(newCategoryName) {
		if (newCategoryName === '') {
			return;
		}

		const newCategory = new ProfileField({cname: newCategoryName});
		this.profileFields.push(newCategory);
	}

	onFieldAdd(newField) {
		if (newField === {}) {
			return;
		}

		const field = new ProfileField(newField);
		this.profileFields.push(field);
	}

	onRemoveNode(node) {
		this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
			disableClose: false
		});

		this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

		this.confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				let parent = this.findParent(node, this.profileFields);
				parent = parent == this.profileFields ? parent : parent.elements;
				const index = parent.findIndex(v => v == node);
				parent.splice(index, 1);
			}
		});
	}

	private findParent(element, searched) {
		if (searched instanceof Array) {
			const index = this.profileFields.findIndex(v => v == element);
			if (index < 0) {
				const filtered = searched.filter(v => v.elements && v.elements.length);
				if (filtered.length > 0) {
					let result = null;
					filtered.every(v => {
						result = this.findParent(element, v);
						return result ? false : true;
					});
					return result;
				} else {
					return null;
				}
			} else {
				return searched;
			}
		} else {
			if (searched.elements && searched.elements.length) {
				let result = null;
				const index = searched.elements.findIndex(v => v == element);
				if (index > -1) {
					return searched;
				} else {
					const filtered = searched.elements.filter(v => v.elements && v.elements.length);
					if (filtered.length > 0) {
						let result = null;
						filtered.every(v => {
							result = this.findParent(element, v);
							return result ? false : true;
						});
						return result;
					} else {
						return null;
					}
				}
			} 
		}
	}
}
