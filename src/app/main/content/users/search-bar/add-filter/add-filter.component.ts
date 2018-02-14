import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-users-filters-dialog',
    templateUrl: './add-filter.component.html',
    styleUrls: ['./add-filter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersAddFilterDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<UsersAddFilterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any) { }

    ngOnInit() {
    }

}
