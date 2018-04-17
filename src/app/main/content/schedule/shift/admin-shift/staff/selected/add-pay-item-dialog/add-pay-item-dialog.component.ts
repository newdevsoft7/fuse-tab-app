import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-pay-item-dialog',
    templateUrl: './add-pay-item-dialog.component.html',
    styleUrls: ['./add-pay-item-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPayItemDialogComponent implements OnInit {

    readonly types: string[] = [
        'bonus',
        'deduction',
        'expense',
        'travel',
        'other'
    ];

    form: FormGroup;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddPayItemDialogComponent>,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            item_type: [null, Validators.required],
            item_name: ['', Validators.required],
            unit_rate: [0, Validators.required],
            units: [0, Validators.required]
        });
    }

    saveForm() {
        if (this.form.invalid) { return; }
        this.dialogRef.close(this.form.getRawValue());
    }

}
