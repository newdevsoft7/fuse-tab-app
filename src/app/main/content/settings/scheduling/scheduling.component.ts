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
import { SCMessageService } from '../../../../shared/services/sc-message.service';
import { TokenStorage } from '../../../../shared/services/token-storage.service';

enum Setting {
    shift_enable = 46,
    shift_default_times_locked = 47,
    shift_timezone_display = 48,
    shift_standby_unavailable = 49,
    shift_application_reason = 50,
    shift_staff_confirm = 51,
    shift_msg_application = 52,
    shift_msg_confirmation = 53,
    shift_msg_completion = 54,
    shift_calendar_overnight_single = 55,
    // shift_table_columns = 11,
    shift_replacement_request = 56,
    shift_msg_replacement_request = 57,
    shift_replacement_request_deadline = 58,
    shift_msg_replacement_request_na = 59,
    shift_replacement_request_email = 60
}

@Component({
    selector: 'app-settings-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsSchedulingComponent implements OnInit, OnChanges, OnDestroy {

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

    // Form Controls
    deadline = new FormControl();

    shiftStatuses: any[] = [];
    staffStatuses: any[] = [];

    // Slide Togglable Items
    checkableItems = [
        Setting.shift_enable,
        Setting.shift_default_times_locked,
        Setting.shift_timezone_display,
        Setting.shift_standby_unavailable,
        Setting.shift_application_reason,
        Setting.shift_staff_confirm,
        Setting.shift_calendar_overnight_single,
        Setting.shift_replacement_request
    ];

    // Number Items
    numberItems = [
        Setting.shift_replacement_request_deadline
    ];

    componentDestroyed = new Subject();

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private scMessageService: SCMessageService,
        private tokenStorage: TokenStorage
    ) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {
            
            const keys = Object.keys(this.Setting).filter(v => !_.isNaN(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    if (this.checkableItems.includes(item.id)) { // Slide Togglable Items
                        this.items = { ...this.items, [item.id]: _.toInteger(item.value) === 0 ? false : true };
                    } else if (this.numberItems.includes(item.id)) { // Number Fields
                        switch (item.id) {
                            case Setting.shift_replacement_request_deadline:
                                this.deadline.patchValue(item.value);
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

    async ngOnInit() {

        // Deadline Control
        this.deadline.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                if (value != '') {
                    this.onChange(Setting.shift_replacement_request_deadline, value);
                }
            });

        this.fetchShiftStatues();
        this.fetchStaffStatues();
    }

    async fetchShiftStatues() {
        try {
            this.shiftStatuses = await this.settingsService.getShiftStatuses();
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async fetchStaffStatues() {
        try {
            this.staffStatuses = await this.settingsService.getStaffStatuses();
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async onShiftChange(value, status, type) {
        if (value !== '') {
            const body = { [type]: value };
            try {
                await this.settingsService.saveShiftStatus(status.id, body);
            } catch (e) {
                this.scMessageService.error(e);
            }
        }
    }

    async onStaffChange(value, status, type) {
        if (value !== '') {
            const body = { [type]: value };
            try {
                await this.settingsService.saveStaffStatus(status.id, body);
            } catch (e) {
                this.scMessageService.error(e);
            }
        }
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.unsubscribe();
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
            this.updateSettingsOnStorage(id, value);
            this.settingsChange.next(this.settings);
            if (id === Setting.shift_enable) {
                this.settingsService.schedulingEnableChanged.next(value);
            }
        });
    }

    updateSettingsOnStorage(id, value) {
      const key = this.Setting[id];
      const settings = this.tokenStorage.getSettings();
      if (settings.hasOwnProperty(key)) {
        settings[key] = value;
      }
      this.tokenStorage.setSettings(settings);
    }

}
