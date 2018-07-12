import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../user.service';

@Component({
    selector: 'app-user-withdraw-dialog',
    templateUrl: './withdraw-dialog.component.html',
    styleUrls: ['./withdraw-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserWithdrawDialogComponent implements OnInit {

    type: string;
    wallet: any;
    user: any;
    value: any;
    banks: any[];
    form: FormGroup;
    bankForm: FormGroup;
    paypalForm: FormGroup;
    otpSent: boolean;
    message: string;
    otp: string;

    constructor(
        public dialogRef: MatDialogRef<UserWithdrawDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toastr: ToastrService,
        private userService: UserService
    ) {
        this.type = data.type;
        this.banks = data.banks;
        this.wallet = data.wallet;
        this.user = data.user;
        this.value = data.value;
    }

    ngOnInit() {
        switch(this.type) {
            case 'bank':
                this.bankForm = this.formBuilder.group({
                    method: [this.type],
                    amount: [null, Validators.required],
                    bank_id: [this.banks.length === 1 ? this.banks[0].id : null, Validators.required],
                });
                break;

            case 'paypal':
            case 'prepaid':
                this.paypalForm = this.formBuilder.group({
                    method: [this.type],
                    amount: [null, Validators.required],
                    email: [this.value, Validators.required]
                });
                break;
        }
    }

    async save() {
        this.form = this.type === 'bank' ? this.bankForm : this.paypalForm;
        try {
            const res = await this.userService.userWithdraw(this.user.id, this.wallet.id, this.form.getRawValue());
            this.otpSent = res.otp_sent;
            this.message = res.message;
        } catch (e) {
            this.displayError(e);
        }
    }

    async confirm() {
        const body = {
            ...this.form.getRawValue(),
            otp: this.otp
        };
        try {
            const res = await this.userService.userWithdraw(this.user.id, this.wallet.id, body);
            this.dialogRef.close(true);
            this.toastr.success(res.message)
        } catch (e) {
            this.displayError(e);
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
