import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-add-invoice-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddInvoiceItemDialogComponent implements OnInit {

  items = [];
  type: string;
  onItemAdded: Subject<any>;

  constructor(
    public dialogRef: MatDialogRef<AddInvoiceItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.items = _.cloneDeep(data.items);
    this.type = data.type;
    this.onItemAdded = data.onItemAdded;
  }

  ngOnInit() {
  }

  addItem(item) {
    this.items.splice(this.items.findIndex(v => v.id === item.id), 1);
    this.onItemAdded.next({ item, type: this.type });
  }

}
