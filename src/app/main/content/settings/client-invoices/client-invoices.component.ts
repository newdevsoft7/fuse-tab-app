import {
    Component, OnInit, Input,
    IterableDiffers, SimpleChanges,
    OnChanges, Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    client_invoice_enable = 18,
    client_invoice_top = 19,
    client_invoice_notes = 20,
    client_invoice_bottom = 21,
    client_invoice_stripe_key = 22,
    client_invoice_stripe_secret = 23,
}


@Component({
    selector: 'app-settings-client-invoices',
    templateUrl: './client-invoices.component.html',
    styleUrls: ['./client-invoices.component.scss']
})
export class  SettingsClientInvoicesComponent implements OnInit, OnChanges {

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

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.settings) {
            const keys = Object.keys(this.Setting).filter(v => typeof v === 'string') as string[];
            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['setting', v]);
                if (!_.isUndefined(item)) {
                    this.items = { ...this.items, [item.setting]: item.value };
                }
            });
        }
    }

    ngOnInit() {
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
            this.toastr.success(res.message);
        });
    }

}
