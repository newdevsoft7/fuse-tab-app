import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

@Component({
    selector: 'app-group-edit-workareas-dialog',
    templateUrl: './edit-workareas-dialog.component.html',
    styleUrls: ['./edit-workareas-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupEditWorkareasDialogComponent implements OnInit {

    options;
    values;

    constructor(
        public dialogRef: MatDialogRef<GroupEditWorkareasDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.values = this.data.workareas.map(v => v.id);
        this.options = this.data.options;
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.values);
    }

}
