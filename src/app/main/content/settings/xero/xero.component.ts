import {
    Component, OnInit, Input, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import {
    MatSlideToggleChange, MatSelectChange,
    MatDatepickerInputEvent
} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SettingsService } from '../settings.service';

enum Setting {
    xero_enable = 97,
    xero_client_invoice = 98,
    xero_staff_invoice = 99,
    xero_payroll = 100,
    xero_payroll_calendar = 101,
    xero_key = 102,
    xero_secret = 103
}

@Component({
    selector: 'app-settings-xero',
    templateUrl: './xero.component.html',
    styleUrls: ['./xero.component.scss']
})
export class SettingsXeroComponent implements OnInit, OnChanges {

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

    items: any = {}; // All Settings

    // Slide Togglable Items
    checkableItems = [
        Setting.xero_enable,
        Setting.xero_client_invoice,
        Setting.xero_staff_invoice,
        Setting.xero_payroll
    ];

    // Number Items
    numberItems = [
    ];

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
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
            this.toastr.success(res.message);
        });
    }

    changeDate(event: MatDatepickerInputEvent<Date>) {
        if (!event.value) return;
        const date = moment(event.value).format('YYYY-MM-DD');
        this.onChange(Setting.xero_payroll_calendar, date);
    }

}
