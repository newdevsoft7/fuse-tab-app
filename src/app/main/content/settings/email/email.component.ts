import {
    Component, OnInit, Input,
    IterableDiffers, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, ElementRef
} from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms'

import { Observable } from 'rxjs/Rx';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    company_email_from = 24,
    company_email_address = 25,
    company_email_signature = 26,
    email_header = 123,
    email_subcopy = 124,
    email_footer = 125
}


@Component({
    selector: 'app-settings-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})
export class SettingsEmailComponent implements OnInit, OnChanges {

	_settings = [];

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    items: any = {};
    externalEmails: any[] = [];
    signature = new FormControl();
    form: FormGroup;

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.settings) {
            const keys = Object.keys(this.Setting).filter(v => !_.isNaN(_.toNumber(v))) as string[];
            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    this.items = { ...this.items, [item.id]: item.value };
                    if (item.id === Setting.company_email_signature) {
                        // Patch FroalaEditor form control value 
                        this.signature.patchValue(item.value);
                    }
                }
            });
        }
    }

    async ngOnInit() {

        // Main Email Signature
        this.signature.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .subscribe(value => {
                this.onChange(Setting.company_email_signature, value);
            });

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required]
        });
        
        try {
            this.externalEmails = await this.settingsService.getExternalEmails();
        } catch(e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
    }

    onChange(id: Setting, event: MatSlideToggleChange | string) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        let value;

        if (event instanceof MatSlideToggleChange) { // Slide Toggle
            value = event.checked ? 1 : 0;
        } else { // Input Text
            value = event;
        }
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            //this.toastr.success(res.message);
        });
    }

    async addExternalEmail() {
        if (this.externalEmails.length < 10) {
            try {
                const res = await this.settingsService.saveExternalEmail(this.form.getRawValue());
                const data = {
                    id: res.data.id,
                    name: `${res.data.name} <${res.data.email}>`
                };
                this.externalEmails.push(data);
            } catch (e) {
                this.toastr.error(e.message || 'Something is wrong!');
            }
        }
    }

    async deleteExternalEmail(email) {
        try {
            const index = this.externalEmails.findIndex(v => v.id === email.id);
            this.externalEmails.splice(index, 1);
            await this.settingsService.deleteExternalEmail(email.id);
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
    }
}
