import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TRACKING_CATEGORY_STAFF_VISIBILITY, TRACKING_CATEGORY_CLIENT_VISIBILITY } from "../../../tracking/tracking.models";

import * as _ from 'lodash';

@Component({
  selector: 'app-tracking-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryDialogComponent {

  data: any;
  title: string;

  staffVisibility: any = TRACKING_CATEGORY_STAFF_VISIBILITY;
  clientVisibility: any = TRACKING_CATEGORY_CLIENT_VISIBILITY;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.data = data? _.cloneDeep(data) : {};
    this.title = this.data.cname || 'New Category';
  }
}
