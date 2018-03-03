import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'app-staff-shift-pay-item-dialog',
    templateUrl: './pay-item-dialog.component.html',
    styleUrls: ['./pay-item-dialog.component.scss']
})
export class StaffShiftPayItemDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
    }

    showInfo() {
        const items = this.data.payItems;
        return items.map(item => `${item.units} x $${item.unit_rate} ${item.item_type}`).join(', ')
    }

}
