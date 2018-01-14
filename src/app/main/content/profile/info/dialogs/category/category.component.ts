import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';

@Component({
	selector: 'app-profile-info-category-dialog',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileInfoCategoryDialogComponent implements OnInit {
    category: any;
    isCreate: boolean = false;

	constructor(
        public dialogRef: MatDialogRef<ProfileInfoCategoryDialogComponent>,
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
