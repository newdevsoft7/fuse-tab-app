import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../../user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SCMessageService } from '../../../../../../../../shared/services/sc-message.service';

@Component({
	selector: 'app-user-settings-xtrm-add-bank-dialog',
	templateUrl: './add-bank-dialog.component.html',
	styleUrls: ['./add-bank-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UserSettingsXtrmAddBankDialogComponent implements OnInit, OnDestroy {

	submitting = false;
	country: any;
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
	bankRouting: any = {
		bank_routing_label: 'Routing No',
		bank_routing_min: 2,
		bank_routing_max: 15
	};
	searchShow = true;
	resultShow = false;

	constructor(
		public dialogRef: MatDialogRef<UserSettingsXtrmAddBankDialogComponent>,
		private userService: UserService,
		private toastr: ToastrService,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) private data: any,
		private scMessageService: SCMessageService
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
			contact_name: ['', Validators.required],
			currency: ['', Validators.required],
			wtype: ['', Validators.required],
			country_code: ['', Validators.required],
			bank_name: ['', Validators.required],
			bank_swift: ['', Validators.required],
			bank_account: ['', Validators.required],
			bank_routing: ['', Validators.required],
			bank_branch: ['', Validators.required]
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
				countryCode: this.country.iso2,
				page: this.page,
				city: this.city.trim()
			});
			this.showMore = res.show_more;
			this.banks = res.banks;
			this.resultShow = true;
			this.searchShow = this.banks.length > 0 ? false : true;
		} catch (e) {
			this.scMessageService.error(e);
		}
	}

	async getMoreBanks() {
		try {
			this.fetchingBanks = true;
			const res = await this.userService.searchBanks({
				bankName: this.bankName.trim(),
				countryCode: this.country.iso2,
				page: ++this.page,
				city: this.city.trim()
			});
			this.showMore = res.show_more;
			this.banks.push(...res.banks);
		} catch (e) {
			this.scMessageService.error(e);
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
            this.scMessageService.error(e);
        }
	}

	get searchDisabled() {
		return !this.country || this.bankName.trim() === '';
	}

	populate(bank) {
		this.makeControldirtyTouched('bank_name');
		this.makeControldirtyTouched('bank_swift');
		this.makeControldirtyTouched('bank_branch');
		this.form.patchValue({
			bank_name: bank.bname,
			bank_swift: bank.swift,
			bank_branch: bank.branch
		});
		this.resultShow = false;
	}

	onCountryChange(country) {
		// xtrm_bank_withdraw_types
		this.wtypes = country.xtrm_bank_withdraw_types.split(',');
		const wtype = this.wtypes.length > 1 ? '' : this.wtypes[0];
		this.searchShow = true;
		if (country.bank_routing_label) {
			this.form = this.formBuilder.group({
				contact_name: ['', Validators.required],
				currency: [country.currency_code, Validators.required],
				wtype: [wtype, Validators.required],
				country_code: [country.iso2, Validators.required],
				bank_name: ['', Validators.required],
				bank_swift: ['', Validators.required],
				bank_account: ['', Validators.required],
				bank_routing: ['', Validators.required],
				bank_branch: ['', Validators.required]
			});
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
			this.bankRouting = {
				bank_routing_label: country.bank_routing_label,
				bank_routing_min: country.bank_routing_min,
				bank_routing_max: country.bank_routing_max
			};
		} else {
			this.form = this.formBuilder.group({
				contact_name: ['', Validators.required],
				currency: [country.currency_code, Validators.required],
				wtype: [wtype, Validators.required],
				country_code: [country.iso2, Validators.required],
				bank_name: ['', Validators.required],
				bank_swift: ['', Validators.required],
				bank_account: ['', Validators.required],
				bank_branch: ['', Validators.required]
			});
			this.formErrors = {
				contact_name: {},
				currency: {},
				wtype: {},
				country_code: {},
				bank_name: {},
				bank_swift: {},
				bank_account: {},
				bank_branch: {}
			};
			this.bankRouting = null;
		}
		
	}

	private makeControldirtyTouched(control: string) {
		this.form.controls[control].markAsDirty();
		this.form.controls[control].markAsTouched();
	}

}
