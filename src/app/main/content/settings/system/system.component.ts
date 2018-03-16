import {
    Component, OnInit, Input,
    IterableDiffers, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { FormControl, Validators } from '@angular/forms'

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    company_name = 87,
    system_name = 88,
    company_website = 89,
    company_address = 90,
    company_city = 91,
    company_state = 92,
    company_postcode = 93,
    company_country = 93
}

@Component({
    selector: 'app-settings-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.scss']
})
export class SettingsSystemComponent implements OnInit, OnChanges {

    _settings = [];

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];
    countries = [];

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    items: any = {}; // All Settings

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.settings) {
            const keys = Object.keys(this.Setting).filter(v => _.isNaN(_.toNumber(v))) as string[];
            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['setting', v]);
                if (!_.isUndefined(item)) {
                    this.items = { ...this.items, [item.setting]: item.value };
                }
            });
        }

        if (changes.options) {
            if (!_.isEmpty(this.options)) {
                this.countries = this.options['2']; // 2 is country in options
            }
        }
    }

    ngOnInit() {
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
            this.toastr.success(res.message);
        });
    }

}
