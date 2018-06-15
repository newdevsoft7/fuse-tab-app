import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange } from '@angular/material';
import * as _ from 'lodash';
import { SettingsService } from '../settings.service';

enum Setting {
    survey_enable = 86
}

@Component({
    selector: 'app-settings-surveys',
    templateUrl: './surveys.component.html',
    styleUrls: ['./surveys.component.scss']
})
export class SettingsSurveysComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    readonly Setting = Setting;

    @Output() settingsChange = new EventEmitter();

    constructor(
      private settingsService: SettingsService
    ) { }

    ngOnInit() { }

    value(id: Setting) {
        if (_.isEmpty(this.settings))  {
            return;
        }
        const value = _.find(this.settings, ['id', id]);
        return _.toInteger(value.value) === 0 ? false : true;
    }

    onChange(id: Setting, event: MatSlideToggleChange) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        const value = event.checked ? 1 : 0;
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            this.settingsService.surveysEnableChanged.next(value);
        });
    }
}
