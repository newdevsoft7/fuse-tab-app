import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-pay-level-item',
    templateUrl: './pay-level-item.component.html',
    styleUrls: ['./pay-level-item.component.scss']
})
export class SettingsPayLevelItemComponent implements OnInit {

    @ViewChild('nameInput') nameInputField;
    @Input() level;

    formActive = false;
    form: FormGroup;

    readonly TYPE = [
        { label: '/hr', value: 'phr' },
        { label: 'flat', value: 'flat' }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    focusNameField() {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    openForm() {
        this.form = this.formBuilder.group({
            pname: [this.level.pname, Validators.required],
            pay_rate: [this.level.pay_rate, Validators.required],
            pay_rate_type: [this.level.pay_rate_type, Validators.required],
            pay_cat_id: [this.level.pay_cat_id]
        });
        this.formActive = true;
        this.focusNameField();
    }

    closeForm() {
        this.formActive = false;
    }

    delete() {
        this.formActive = false;
    }

    saveForm() {
        const params = this.form.value;
        this.settingsService.updatePayLevel(this.level.id, params).subscribe(res => {
            this.level = { ...this.level, ...params };
            this.toastr.success(res.message);
        }, err => {
            this.displayError(err);
        });
        this.formActive = false;
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}
