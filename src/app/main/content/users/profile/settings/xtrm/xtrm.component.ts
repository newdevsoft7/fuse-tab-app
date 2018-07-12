import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../user.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UserSettingsXtrmAddBankDialogComponent } from './dialogs/add-bank-dialog/add-bank-dialog.component';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { UserWithdrawDialogComponent } from './dialogs/withdraw-dialog/withdraw-dialog.component';

@Component({
    selector: 'app-users-settings-xtrm',
    templateUrl: './xtrm.component.html',
    styleUrls: ['./xtrm.component.scss']
})
export class UsersSettingsXtrmComponent implements OnInit {

    user: any;
    xtrm: any = {};
    loaded = false;
    otpSent: boolean;
    setup = false;
    sentSetXtrmRequest = false;
    verficationCode: string;
    countries: any[];
    currencies: any[];

    constructor(
        private tokenStorage: TokenStorage,
        private userService: UserService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { 
        this.user = tokenStorage.getUser();
    }

    async ngOnInit() {
        this.getCountries();
        this.getCurrencies();
        try {
            await this.getXtrmSetup();
        } finally {
            this.loaded = true;
        }
    }

    async getXtrmSetup() {
        try {
            this.xtrm = await this.userService.getXtrmSetup(this.user.id);
            this.setup = this.xtrm.set_up;
            this.otpSent = this.xtrm.otp_sent;
        } catch (e) {
            this.displayError(e);
        }
    }

    async setXtrmSetup() {
        try {
            const res = await this.userService.setXtrmSetup(this.user.id);
            this.setup = true;
            this.otpSent = res.otp_sent;
            this.sentSetXtrmRequest = true;
        } catch (e) {
            this.displayError(e);
        }
    }

    async authorize(code) {
        try {
            await this.userService.authorizeXtrmSetup(this.user.id, code);
            this.getXtrmSetup();
        } catch (e) {
            this.displayError(e);
        }
    }

    async getCountries() {
        try {
            this.countries = await this.userService.getCountriesForBank();
        } catch (e) {
            this.displayError(e);
        }
    }


    async getCurrencies() {
        try {
            this.currencies = await this.userService.getCurrencies();
        } catch (e) {
            this.displayError(e);
        }
    }

    withdraw(method, wallet) {
        switch (method.id) {
            case 'bank':
                if (method.options.length > 0) {
                    this.openWithdrawDialog(method, wallet);
                } else {
                    const dialogRef = this.dialog.open(UserSettingsXtrmAddBankDialogComponent, {
                        disableClose: false,
                        panelClass: 'user-settings-xtrm-add-bank-dialog',
                        data: {
                            countries: this.countries,
                            currencies: this.currencies,
                            user: this.user
                        }
                    });
                    dialogRef.afterClosed().subscribe(bank => {
                        if (bank) {
                            this.xtrm.banks.push(bank);
                            method.options.push({
                                id: bank.id,
                                bname: bank.bname
                            });
                            this.openWithdrawDialog(method, wallet);
                        }
                    });
                }
                break;

            case 'paypal':
            case 'prepaid':
                this.openWithdrawDialog(method, wallet);
                break;
        }
    }

    openWithdrawDialog(method, wallet) {
        let data: any = {
            wallet,
            type: method.id,
            user: this.user,
            value: method.value
        };
        if (method.id === 'bank') {
            data.banks = method.options;
        }
        const dialogRef = this.dialog.open(UserWithdrawDialogComponent, {
            disableClose: false,
            panelClass: 'user-withdraw-dialog',
            data: data
        });
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    this.xtrm.wallets = await this.userService.getUserWallets(this.user.id);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    openAddBankDialog() {
        const dialogRef = this.dialog.open(UserSettingsXtrmAddBankDialogComponent, {
            disableClose: false,
            panelClass: 'user-settings-xtrm-add-bank-dialog',
            data: {
                countries: this.countries,
                currencies: this.currencies,
                user: this.user
            }
        });
        dialogRef.afterClosed().subscribe(bank => {
            if (bank) {
                this.xtrm.banks.push(bank);
            }
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
