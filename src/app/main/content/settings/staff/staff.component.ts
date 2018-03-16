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
    staff_inactive_after = 62,
    staff_inactive_message = 63,
    staff_blacklisted_login = 64,
    staff_blacklisted_msg =65,
    staff_see_others = 66,
    staff_see_others_photo = 67,
    staff_see_others_name = 68,
    staff_see_others_mob = 69,
    staff_see_shift_address = 70,
    staff_see_shift_contact = 71,
    staff_see_shift_manager = 72,
    staff_see_shift_notes = 73,
    staff_see_role_notes = 74,
    staff_see_role_required = 75,
    staff_change_work_areas = 76,
    staff_upload_shift_files = 77,
}

@Component({
    selector: 'app-settings-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class SettingsStaffComponent implements OnInit, OnChanges, OnDestroy {

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

    readonly selection1 = [
        { label: 'Always', value: 'always' },
        { label: 'After Selection', value: 'after_selection' },
        { label: 'Never', value: 'never' }
    ];

    readonly selection2 = [
        { label: 'Always', value: 'always' },
        { label: 'After Selection', value: 'after_selection' },
    ]

    items: any = {}; // All Settings

    // Slide Togglable Settings
    readonly checkableItems = [
        Setting.staff_blacklisted_login,
        Setting.staff_see_others_photo,
        Setting.staff_see_others_name,
        Setting.staff_see_others_mob,
        Setting.staff_change_work_areas,
        Setting.staff_upload_shift_files
    ];

    // Form Controls
    automaticInactive = new FormControl();

    componentDestroyed = new Subject(); // Component Destroy

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
                    if (this.checkableItems.includes(item.id)) { // Checkable Items
                        this.items = { ...this.items, [item.setting]: _.toInteger(item.value) === 0 ? false : true };
                    } else {
                        this.items = { ...this.items, [item.setting]: item.value };
                    }
                    if (item.setting === 'staff_inactive_after') {
                        this.automaticInactive.patchValue(this.items.staff_inactive_after);
                    }
                }
            });
        }
    }

    ngOnInit() {

        // Automatic Inactive Control
        this.automaticInactive.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                this.onChange(Setting.staff_inactive_after, value);
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
            this.toastr.success(res.message);
        });
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.unsubscribe();
    }

}
