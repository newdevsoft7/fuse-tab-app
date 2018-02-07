import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ProfileAttributeCategory } from '../../profile-attribute.models';

@Component({
	selector: 'app-profile-attributes-category-dialog',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileAttributesCategoryDialogComponent implements OnInit {
    category: ProfileAttributeCategory;
    isCreate: boolean = false;

	constructor(
        public dialogRef: MatDialogRef<ProfileAttributesCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialog: MatDialog
	) { }

	ngOnInit() {
        this.category = { ...this.data.category };
        this.isCreate = this.data.isCreate;
    }
    
    onSave() {
        this.dialogRef.close(this.category);
    }

}
