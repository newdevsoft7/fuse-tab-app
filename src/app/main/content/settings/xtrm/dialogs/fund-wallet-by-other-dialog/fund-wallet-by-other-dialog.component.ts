import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../settings.service';
import { ToastrService } from 'ngx-toastr';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-fund-wallet-by-other-dialog',
    templateUrl: './fund-wallet-by-other-dialog.component.html',
    styleUrls: ['./fund-wallet-by-other-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FundWalletByOtherDialogComponent implements OnInit, OnDestroy {

    cardTypes = [
        { label: 'Visa', value: 'Visa Card' },
        { label: 'Master', value: 'Master Card' },
        { label: 'AMEX', value: 'AMEX Card' }
    ];
    form: FormGroup;
    formErrors: any;
    wallet: any;
    submitting = false;
    formChangeSubscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<FundWalletByOtherDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private scMessageService: SCMessageService
    ) {
        this.wallet = this.data.wallet;
        this.formErrors = {
            type: {},
            wallet_id: {},
            amount: {},
            fname: {},
            lname: {}
        };
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            type: [this.data.type, Validators.required],
            wallet_id: [this.wallet.id, Validators.required],
            amount: [null, Validators.required],
            fname: ['', Validators.required],
            lname: ['', Validators.required]
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
        try {
            const res = await this.settingsService.fundCompanyWallet(body.type, body);
            this.toastr.success(res.message);
            this.dialogRef.close(res.wallet);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

}
