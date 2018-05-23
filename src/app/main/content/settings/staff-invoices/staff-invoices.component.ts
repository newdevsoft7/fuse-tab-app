import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
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
    staff_invoice_enable = 78,
    staff_invoice_default = 79,
    staff_invoice_combine = 80,
    staff_invoice_weekly = 81,
    staff_invoice_deadline = 82,
    staff_invoice_msg_creation = 83,
    staff_invoice_top = 84,
    staff_invoice_financial = 85
}

@Component({
    selector: 'app-settings-staff-invoices',
    templateUrl: './staff-invoices.component.html',
    styleUrls: ['./staff-invoices.component.scss']
})
export class SettingsStaffInvoicesComponent implements OnInit {

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
        Setting.staff_invoice_enable,
        Setting.staff_invoice_combine,
        Setting.staff_invoice_weekly
    ];

    // Number Items
    numberItems = [
        Setting.staff_invoice_deadline
    ];

    invoices = [
        { label: 'All', value: 'all' },
        { label: 'Specify', value: 'specify' }
    ];

    // Form Controls
    invoiceDeadline = new FormControl();

    componentDestroyed = new Subject();

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {
            
            const keys = Object.keys(this.Setting).filter(v => _.isNumber(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    if (this.checkableItems.includes(item.id)) { // Slide Togglable Items
                        this.items = { ...this.items, [item.id]: _.toInteger(item.value) === 0 ? false : true };
                    } else if (this.numberItems.includes(item.id)) { // Number Fields
                        switch (item.id) {
                            case Setting.staff_invoice_deadline:
                                this.invoiceDeadline.patchValue(item.value);
                                break;
                            
                            default:
                                break;
                        }
                    } else { // Text Fields
                        this.items = { ...this.items, [item.id]: item.value };
                    }
                }
            });
        }

    }

    ngOnInit() {
        // Invoice Deadline Control
        this.invoiceDeadline.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                this.onChange(Setting.staff_invoice_deadline, value);
            });
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
            //this.toastr.success(res.message);
        });
    }
}
