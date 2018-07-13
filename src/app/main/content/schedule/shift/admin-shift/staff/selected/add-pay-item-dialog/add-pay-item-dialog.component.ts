import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorage } from '../../../../../../../../shared/services/token-storage.service';

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

    isBillEntered = false;
    isPriceEntered = false;
    form: FormGroup;
    currencies: any[];
    settings: any;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddPayItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private tokenStorage: TokenStorage
    ) {
        this.currencies = data.currencies;
        this.settings = tokenStorage.getSettings();
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            item_type: [null, Validators.required],
            item_name: ['', Validators.required],
            unit_rate: [null, Validators.required],
            units: [1, Validators.required],
            bill_unit_rate: [null, Validators.required],
            bill_units: [1, Validators.required],
            bill_currency: [this.settings.currency],
            currency: [this.settings.currency]
        });

        if (this.data.from === 'bill') {
            this.form.controls['bill_unit_rate'].valueChanges
                .debounceTime(500)
                .subscribe(val => {
                    const c = this.form.get('unit_rate');
                    if (!c.value) {
                        c.patchValue(val);
                    }
                });
            this.form.controls['bill_units'].valueChanges
                .debounceTime(500)
                .subscribe(val => {
                    const c = this.form.get('units');
                    if (!c.value) {
                        c.patchValue(val);
                    }
                });
            this.form.controls['bill_currency'].valueChanges
                .subscribe(val => {
                    if(!this.isPriceEntered) {
                        const c = this.form.get('currency');
                        c.patchValue(val);
                    }
                });
        } else {
            this.form.controls['unit_rate'].valueChanges
                .debounceTime(500)
                .subscribe(val => {
                    const c = this.form.get('bill_unit_rate');
                    if (!c.value) {
                        c.patchValue(val);
                    }
                });
            this.form.controls['units'].valueChanges
                .debounceTime(500)
                .subscribe(val => {
                    const c = this.form.get('bill_units');
                    if (!c.value) {
                        c.patchValue(val);
                    }
                });
            this.form.controls['currency'].valueChanges
                .subscribe(val => {
                    if(!this.isBillEntered) {
                        const c = this.form.get('bill_currency');
                        c.patchValue(val);
                    }
                });
        }
    }

    saveForm() {
        if (this.form.invalid) { return; }
        this.dialogRef.close(this.form.getRawValue());
    }

}
