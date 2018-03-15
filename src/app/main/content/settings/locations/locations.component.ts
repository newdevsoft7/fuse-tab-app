import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    locations_enable = 30,
    location_address = 31,
    location_contact = 32,
    location_geocode = 33
}

@Component({
    selector: 'app-settings-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class SettingsLocationsComponent implements OnInit {
	
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
        return _.toInteger(value.value) === 0 ? false : true;
    }

    onChange(id: Setting, event: MatSlideToggleChange) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        const value = event.checked ? 1 : 0;

        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            this.toastr.success(res.message);
        });
    }

}
