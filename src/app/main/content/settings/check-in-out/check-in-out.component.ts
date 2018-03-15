import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    check_in_start = 10,
    check_in_out_enable = 12,
    check_in_photo_enable = 13,
    check_out_photo_enable = 14,
    check_in_no_show = 15
}

@Component({
    selector: 'app-settings-check-in-out',
    templateUrl: './check-in-out.component.html',
    styleUrls: ['./check-in-out.component.scss']
})
export class SettingsCheckInOutComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    @Output() settingsChange = new EventEmitter();
    
    readonly Setting = Setting;

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }
    
    value(id: Setting) {
        if (_.isEmpty(this.settings)) return;
        const value = _.find(this.settings, ['id', id]);
        if ([Setting.check_in_start, Setting.check_in_no_show].includes(id)) {
            return _.toInteger(value.value);
        } else {
            return _.toInteger(value.value) === 0 ? false : true;
        }
    }

    onChange(id: Setting, event: MatSlideToggleChange | MatSelectChange) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        let value;

        if (event instanceof MatSlideToggleChange) { // Slide Toggle
            value = event.checked ? 1 : 0;
        } else { // Select
            value = event.value;
        }
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            this.toastr.success(res.message);
        });
    }

}
