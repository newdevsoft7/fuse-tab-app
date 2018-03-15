import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    expenses_enable = 27,
    expenses_staff = 28,
    expense_receipt_required = 29
}

@Component({
    selector: 'app-settings-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss']
})
export class SettingsExpensesComponent implements OnInit {

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
