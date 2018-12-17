import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
    selector: 'app-staff-shift-expenese-dialog',
    templateUrl: './expenese-dialog.component.html',
    styleUrls: ['./expenese-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftExpeneseDialogComponent implements OnInit {

    mode: string = 'add';
    expense: any;
    categories: any[];
    receiptRequired: boolean = false;
    filename: string;
    file: any;

    constructor(
        public dialogRef: MatDialogRef<StaffShiftExpeneseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mode = this.data.mode;
        this.expense = _.cloneDeep(this.data.expense) || {};
        this.categories = this.data.categories || [];
        if (this.categories.length > 0 && this.mode === 'add') {
            this.expense.expense_cat_id = this.categories[0].id;
        }
        this.receiptRequired = this.data.receiptRequired || false; 
    }

    ngOnInit() {
    }

    isValid() {
        if ((this.categories.length > 0 && _.isNil(this.expense.expense_cat_id)) ||
            !this.expense.item_name ||
            _.isNil(this.expense.unit_rate) ||
            this.expense.unit_rate === '') {
            return false;
        }
        if (this.mode === 'add' && this.receiptRequired && !this.file) { return false; }
        return true;
    }
    save() {
        const body = new FormData();
        body.append('role_staff_id', this.data.role_staff_id);
        body.append('item_name', this.expense.item_name);
        if (this.mode === 'add') {
            body.append('item_type', 'expense'),
            body.append('units', '1');
        }
        body.append('unit_rate', this.expense.unit_rate);
        if (!_.isNil(this.expense.expense_cat_id)) {
            body.append('expense_cat_id', this.expense.expense_cat_id);
        }
        if (this.file) {
            body.append('receipt', this.file, this.file.name);
        }
        this.dialogRef.close(body);
    }

    change(event) {
        const files = event.target.files; 
        if (files && files.length > 0) {
            this.filename = files[0].name;
            this.file = files[0];
        }
    }

}
