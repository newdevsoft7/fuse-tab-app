import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { SettingsService } from '../../../settings.service';
import { ToastrService } from 'ngx-toastr';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-fund-wallet-by-credit-card-dialog',
    templateUrl: './fund-wallet-by-credit-card-dialog.component.html',
    styleUrls: ['./fund-wallet-by-credit-card-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FundWalletByCreditCardDialogComponent implements OnInit, OnDestroy {

    cardTypes = [
        { label: 'Visa', value: 'Visa Card' },
        { label: 'Master', value: 'Master Card' },
        { label: 'AMEX', value: 'AMEX Card' }
    ];
    form: FormGroup;
    formErrors: any;
    wallet: any;
    countries: any[];
    submitting = false;
    formChangeSubscription: Subscription;
    expiryDatePipe = createAutoCorrectedDatePipe('mm/yyyy');
    expiryDateMask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

    constructor(
        public dialogRef: MatDialogRef<FundWalletByCreditCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private scMessageService: SCMessageService
    ) {
        this.wallet = this.data.wallet;
        this.countries = this.data.countries || [];
        this.formErrors = {
            type: {},
            wallet_id: {},
            amount: {},
            fname: {},
            lname: {},
            address: {},
            city: {},
            state: {},
            country_code: {},
            postcode: {},
            card_number: {},
            card_type: {},
            card_cvv: {},
            expiry_date: {}
        };
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            type: [this.data.type, Validators.required],
            wallet_id: [this.wallet.id, Validators.required],
            amount: [null, Validators.required],
            fname: ['', Validators.required],
            lname: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            country_code: ['', Validators.required],
            postcode: ['', Validators.required],
            card_number: ['', Validators.required],
            card_type: ['Visa Card', Validators.required],
            card_cvv: ['', Validators.required],
            expiry_date: ['', Validators.required]
        });

        this.formChangeSubscription = this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    ngOnDestroy() {
        this.formChangeSubscription.unsubscribe();
    }

    onFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    async onFormSubmit() {
        if (this.form.invalid) { return; }
        let body = this.form.value;
        const [expiry_month, expiry_year] = body.expiry_date.split('/');
        body = {
            ...body,
            card_number: `${body.card_number}`,
            card_cvv: `${body.card_cvv}`,
            expiry_month,
            expiry_year
        };
        try {
            const res = await this.settingsService.fundCompanyWallet(body.type, body);
            this.toastr.success(res.message);
            this.dialogRef.close(res.wallet);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

}
