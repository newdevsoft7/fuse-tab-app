import {
    Component, OnInit, Input, SimpleChanges,
    OnChanges, Output, EventEmitter
} from '@angular/core';

import {
    MatSlideToggleChange, MatSelectChange,
    MatDatepickerInputEvent,
    MatDialog
} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SettingsService } from '../settings.service';
import { SettingsXeroAddKeySecretDialogComponent } from './add-key-secret-dialog/add-key-secret-dialog.component';
import { UserService } from '../../users/user.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

enum Setting {
    xero_enable = 97,
    xero_key = 102,
    xero_secret = 103,

    xero_payroll = 100,
    xero_payroll_country = 144,
    xero_payroll_calendar = 101,
    xero_super_expense_account_code = 142,
    xero_super_liability_account_code = 143,
    xero_payroll_ordinary_earnings_rate_id = 105,
    xero_payroll_deduction_type_id = 106,
    xero_payroll_travel_type_id = 107,
    xero_payroll_expense_type_id = 108,
    xero_payroll_other_type_id = 109,

    xero_client_invoice = 98,
    xero_staff_invoice = 99,
    xero_sinvoice_account_code_shift = 110,
    xero_sinvoice_account_code_travel = 111,
    xero_sinvoice_account_code_expense = 112,
    xero_sinvoice_account_code_bonus = 113,
    xero_sinvoice_account_code_deduction = 114,
    xero_sinvoice_account_code_other = 115
    
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

    @Input() options: any;

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    items: any = {}; // All Settings
    isModalOpen = false;
    countries: any[] = [];

    // Slide Togglable Items
    checkableItems = [
        Setting.xero_enable,
        Setting.xero_payroll,
        Setting.xero_client_invoice,
        Setting.xero_staff_invoice,
    ];

    // Number Items
    numberItems = [
    ];

    selectableItems = [
        Setting.xero_sinvoice_account_code_shift,
        Setting.xero_sinvoice_account_code_travel,
        Setting.xero_sinvoice_account_code_expense,
        Setting.xero_sinvoice_account_code_bonus,
        Setting.xero_sinvoice_account_code_deduction,
        Setting.xero_sinvoice_account_code_other,

        Setting.xero_super_expense_account_code,
        Setting.xero_super_liability_account_code,
        Setting.xero_payroll_ordinary_earnings_rate_id,
        Setting.xero_payroll_deduction_type_id,
        Setting.xero_payroll_travel_type_id,
        Setting.xero_payroll_expense_type_id,
        Setting.xero_payroll_other_type_id,
        Setting.xero_payroll_calendar
    ];
    newOptions: any = {};

    constructor(
        private settingsService: SettingsService,
        private dialog: MatDialog,
        private userService: UserService,
        private scMessageService: SCMessageService
    ) { }

    ngOnInit() {
        this.userService.getCountries().then(countries => this.countries = countries);
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

            if (changes.options && changes.options.currentValue) {
                this.selectableItems.forEach(item => {
                    const options = changes.options.currentValue[item];
                    if (options) {
                        const keys = Object.keys(options);

                        this.newOptions[item] = keys.map(key => {
                            return {
                                value: key,
                                label: options[key]
                            };
                        });
                    }
                });
            }
        }

    }

    async onChangeXeroEnable(event: MatSlideToggleChange) {
        const setting = _.find(this.settings, ['id', Setting.xero_enable]);
        if (event.checked) {
            this.isModalOpen = true;
            const dialogRef = this.dialog.open(SettingsXeroAddKeySecretDialogComponent, {
                disableClose: false,
                panelClass: 'user-settings-xero-add-key-secret-dialog'
            });
            dialogRef.afterClosed().subscribe(async(result) => {
                if (result) {
                    try {
                        await this.settingsService.setSetting(Setting.xero_enable, 1).toPromise();
                        setting.value = 1;
                        this.settingsChange.next(this.settings);
                    } catch (e) {
                        this.items[Setting.xero_enable] = false;
                        this.scMessageService.error(e);
                    } finally {
                        this.isModalOpen = false;
                    }
                } else {
                    this.items[Setting.xero_enable] = false;
                    setting.value = 0;
                    this.settingsChange.next(this.settings);
                    this.isModalOpen = false;
                }
            })
        } else {
            try {
                await this.settingsService.setSetting(Setting.xero_enable, 0).toPromise();
                this.items[Setting.xero_enable] = false;
                setting.value = 0;
                this.settingsChange.next(this.settings);
            } catch (e) {
                this.scMessageService.error(e);
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
        this.settingsService.setSetting(id, value).subscribe(() => {
            setting.value = value;
            this.settingsChange.next(this.settings);
        });
    }

    changeDate(event: MatDatepickerInputEvent<Date>) {
        if (!event.value) return;
        const date = moment(event.value).format('YYYY-MM-DD');
        this.onChange(Setting.xero_payroll_calendar, date);
    }

}
