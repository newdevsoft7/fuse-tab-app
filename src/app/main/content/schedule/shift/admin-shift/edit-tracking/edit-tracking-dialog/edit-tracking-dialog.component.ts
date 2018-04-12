import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

@Component({
    selector: 'app-edit-tracking-dialog',
    templateUrl: './edit-tracking-dialog.component.html',
    styleUrls: ['./edit-tracking-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditTrackingDialogComponent implements OnInit {

    category;
    options;
    values;

    constructor(
        public dialogRef: MatDialogRef<EditTrackingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.category = _.cloneDeep(this.data.category);
        this.values = this.category.options.map(v => v.id);
        this.options = this.data.options;
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.values);
    }

}
