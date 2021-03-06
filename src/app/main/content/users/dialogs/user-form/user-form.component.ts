import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { UserService } from '../../user.service';
import { FilterService } from '@shared/services/filter.service';

@Component({
    selector: 'app-users-user-form-dialog',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UserFormDialogComponent implements OnInit {
    userForm: FormGroup;
    userFormErrors: any;
    users: any = [];

    types: any = [
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' }
    ];

    belongTo: any;

    constructor(
        public dialogRef: MatDialogRef<UserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private filterService: FilterService
    ) {

        this.userFormErrors = {
            lvl: {},
            fname: {},
            lname: {},
            sex: {},
            email: {},
            mob: {},
            password: {}
        };

        if (tokenStorage.getSettings().client_enable === '1') {
            this.types.push({ label: 'Client', value: 'client' });
        }

        if (tokenStorage.getSettings().outsource_enable === '1') {
            this.types.push({ label: 'External Company', value: 'ext' });
        }
    }

    ngOnInit() {
        this.userForm = this.formBuilder.group({
            lvl: ['staff'],
            fname: ['', Validators.required],
            lname: ['', Validators.required],
            sex: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mob: [''],
            password: ['', Validators.required],
            welcome_email: [true]
        });

        this.belongTo = 1;

        this.userForm.valueChanges.subscribe(() => {
            this.onUserFormValuesChanged();
        });

        this.userForm.controls['lvl'].valueChanges.subscribe(() => {
            this.onUserFormLvlChanged();
        });
    }

    onUserFormLvlChanged() {
        if (this.userForm.controls['lvl'].value == 'client' || this.userForm.controls['lvl'].value == 'ext') {
            this.belongTo = null;
        } else {
            this.belongTo = 1;
        }
    }

    onUserFormValuesChanged() {
        for (const field in this.userFormErrors) {
            if (!this.userFormErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.userFormErrors[field] = {};

            // Get the control
            const control = this.userForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.userFormErrors[field] = control.errors;
            }
        }
    }

    onSave() {
        const user = this.userForm.value;
        delete user.welcome_email;
        if (user.lvl === 'client') {
            user.client_id = this.belongTo;
        } else if (user.lvl === 'ext') {
            user.outsource_company_id = this.belongTo;
        }
        user.welcome_email = user.welcome_email ? 1 : 0;
        this.dialogRef.close(user);
    }

    async filterUser(query: string, lvl: string) {
        if (!query) return;
        try {
            if (lvl === 'client') {
                this.users = await this.filterService.getClientFilter(query);
            } else {
                this.users = await this.filterService.getOutsourceCompanyFilter(query);
            }
        } catch (e) {
            this.toastr.error(e.error.message);
        }
    }

    checkBelongTo(user: any) {
        this.belongTo = (typeof user === 'object') ? user.id : null;
    }

    userDisplayFn(user?: any): string {
        return user ? user.cname : '';
    }
}
