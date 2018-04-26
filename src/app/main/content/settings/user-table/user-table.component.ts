import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    user_table_columns = 9
}

@Component({
    selector: 'app-settings-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsUserTableComponent implements OnInit {

    displayedColumns = [];
    availableColumns = [];

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    async ngOnInit() {
        try {
            const option = await this.settingsService.getSettingOptions(Setting.user_table_columns);
            
            // Available columns
            let keys = Object.keys(option.available);
            keys.forEach(key => {
                this.availableColumns.push({
                    value: key,
                    label: option.available[key]
                });
            });

            // Displayed columns
            keys = Object.keys(option.displayed);
            keys.forEach(key => {
                this.displayedColumns.push({
                    value: key,
                    label: option.displayed[key]
                });
            });
        } catch (error) {
            this.toastr.error(error.message || 'Something is wrong while fetching events.');
        }
    }

    save() {
        const  value = this.displayedColumns.map(v => v.value);
        this.settingsService.setSetting(Setting.user_table_columns, value).subscribe(res => {
            this.toastr.success(res.message);
        }, err => {
            this.displayError(err);
        });
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
