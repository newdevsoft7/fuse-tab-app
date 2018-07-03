import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { SettingsService } from '../settings.service';
import { MatSlideToggleChange, MatSelectChange, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FundWalletByCreditCardDialogComponent } from './dialogs/fund-wallet-by-credit-card-dialog/fund-wallet-by-credit-card-dialog.component';
import { FundWalletByOtherDialogComponent } from './dialogs/fund-wallet-by-other-dialog/fund-wallet-by-other-dialog.component';

enum Setting {
    xtrm_enable = 131
}

@Component({
    selector: 'app-settings-xtrm',
    templateUrl: './xtrm.component.html',
    styleUrls: ['./xtrm.component.scss']
})
export class SettingsXtrmComponent implements OnInit, OnChanges {

    @Input() settings = [];
    @Input() options = [];
    @Output() settingsChange = new EventEmitter();
    
    readonly Setting = Setting;

    checkableItems = [
        Setting.xtrm_enable
    ];

    numberItems = [
    ];

    items: any = {}; // All Settings

    xtrm: any = {};
    submitting: boolean = false;
    xtrmForm: FormGroup;
    loaded = false;
    countries: any[] = [];

    constructor(
        private settingsService: SettingsService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) { }

    async ngOnInit() {
        this.xtrmForm = this.formBuilder.group({
            cname: ['', Validators.required],
            web: ['', Validators.required],
            fname: ['', Validators.required],
            lname: ['', Validators.required],
            mob: ['', Validators.required],
            email: ['', Validators.required]
        });
        try {
            await this.getXtrmSetup();
        } catch (e) {
            this.displayError(e);
        } finally {
            this.loaded = true;
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {
            
            const keys = Object.keys(this.Setting).filter(v => _.isNumber(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    if (this.checkableItems.includes(item.id)) { // Slide Togglable Items
                        this.items = { ...this.items, [item.id]: _.toInteger(item.value) === 0 ? false : true };
                    } else if (this.numberItems.includes(item.id)) { // Number Fields

                    } else { // Text Fields
                        this.items = { ...this.items, [item.id]: item.value };
                    }
                }
            });

            if (changes.options) {
                if (!_.isEmpty(this.options)) {
                    this.countries = this.options['2']; // 2 is country in options
                }
            }
        }

    }

    onChange(id: Setting, event: MatSlideToggleChange | MatSelectChange | string) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        let value;

        if (event instanceof MatSlideToggleChange) { // Slide Toggle
            value = event.checked ? 1 : 0;
        } else if (event instanceof MatSelectChange) { // Select Box
            value = event.value;
        } else { // Input Text
            value = event;
        }
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
        });
    }

    async getXtrmSetup() {
        try {
            this.xtrm = await this.settingsService.getXtrmSetup();
            if (!this.xtrm.xtrm_set_up) {
                this.xtrmForm.patchValue({ cname: this.xtrm.cname.value });
            }
        } catch (e) {}
    }

    async saveXtrmSetup() {
        try {
            this.submitting = true;
            await this.settingsService.saveXtrmSetup(this.xtrmForm.value);
            this.submitting = false;
            this.getXtrmSetup();
        } catch (e) {
            this.submitting = false;
            this.displayError(e);
        }
    }

    async onWalletAdded(wallet) {
        try {
            const res = await this.settingsService.createCompanyWallet(wallet);
            this.xtrm.wallets.push(res.wallet);
        } catch (e) {
            this.displayError(e);
        }
    }

    openFundModal(type, wallet) {
        if (type === 'credit_card') {
            const dialogRef = this.dialog.open(FundWalletByCreditCardDialogComponent, {
                disableClose: false,
                panelClass: 'fund-by-credit-card-dialog',
                data: {
                    wallet,
                    type,
                    countries: this.countries
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    wallet.balance = result.balance;
                }
            });
        } else { // ach, wire
            const dialogRef = this.dialog.open(FundWalletByOtherDialogComponent, {
                disableClose: false,
                panelClass: 'fund-by-other-dialog',
                data: {
                    wallet,
                    type
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    wallet.balance = result.balance;
                }
            });
        }
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
