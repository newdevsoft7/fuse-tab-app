import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../../user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-user-settings-xtrm-add-bank-dialog',
	templateUrl: './add-bank-dialog.component.html',
	styleUrls: ['./add-bank-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UserSettingsXtrmAddBankDialogComponent implements OnInit, OnDestroy {

	submitting = false;
	countryCode;
	countries: any[];
	currencies: any[];
	bankName = '';
	city = '';
	banks: any[] = [];
	page = 1;
	showMore = false;
	fetchingBanks = false;
	form: FormGroup;
	formErrors: any;
    formChangeSubscription: Subscription;
	wtypes = ['ACH', 'WIRE'];
	user: any;

	constructor(
		public dialogRef: MatDialogRef<UserSettingsXtrmAddBankDialogComponent>,
		private userService: UserService,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) private data: any
	) {
		this.countries = data.countries || [];
		this.currencies = data.currencies || [];
		this.user = data.user;
		this.formErrors = {
            contact_name: {},
			currency: {},
			wtype: {},
			country_code: {},
			bank_name: {},
			bank_swift: {},
			bank_account: {},
			bank_routing: {},
			bank_branch: {}
        };
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			contact_name: ['', Validators.required], // No
			currency: ['', Validators.required],
			wtype: ['', Validators.required], // No
			country_code: ['', Validators.required],
			bank_name: ['', Validators.required],
			bank_swift: ['', Validators.required],
			bank_account: ['', Validators.required],
			bank_routing: ['', Validators.required],
			bank_branch: ['', Validators.required],
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

	async search() {
		this.page = 1;
		try {
			const res = await this.userService.searchBanks({
				bankName: this.bankName.trim(),
				countryCode: this.countryCode,
				page: this.page,
				city: this.city.trim()
			});
			this.showMore = res.show_more;
			this.banks = res.banks;
		} catch (e) {
			this.displayError(e);
		}
	}

	async getMoreBanks() {
		try {
			this.fetchingBanks = true;
			const res = await this.userService.searchBanks({
				bankName: this.bankName.trim(),
				countryCode: this.countryCode,
				page: ++this.page,
				city: this.city.trim()
			});
			this.showMore = res.show_more;
			this.banks.push(...res.banks);
		} catch (e) {
			this.displayError(e);
		} finally {
			this.fetchingBanks = false;
		}
	}

	async onFormSubmit() {
		if (this.form.invalid) { return; }
        try {
			const res = await this.userService.addUserBank(this.user.id, this.form.value);
			this.dialogRef.close(res.data);
        } catch (e) {
            this.displayError(e);
        }
	}

	get searchDisabled() {
		return !this.countryCode || this.bankName.trim() === '';
	}

	populate(bank) {
		this.form.patchValue({
			bank_name: bank.bname,
			bank_swift: bank.swift,
			bank_branch: bank.branch
		});
	}

	onCountryChange(countryCode) {
		this.form.patchValue({
			country_code: countryCode
		});
	}

	private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }
}
