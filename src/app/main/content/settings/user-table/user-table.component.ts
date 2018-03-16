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
    user_table_columns = 9
}

@Component({
    selector: 'app-settings-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsUserTableComponent implements OnInit, OnChanges {

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

    displayedColumns = [];
    availableColumns = [];

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {
            
            // Sets columns to display
            const keys = Object.keys(this.Setting).filter(v => !_.isNaN(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {

                    // User Table Columns
                    const columns = _.split(item.value, ',');
                    this.displayedColumns = [];
                    _.forEach(columns, (column) => {
                        this.displayedColumns.push({
                            label: this.options[Setting.user_table_columns][column],
                            value: column
                        });
                    });
                }
            });

            // Sets available columns
            if (!_.isEmpty(this.options)) {
                const option = this.options[Setting.user_table_columns];
                this.availableColumns = [];
                Object.keys(option)
                    .filter(v => !_.map(this.displayedColumns, 'value').includes(v))
                    .forEach(key => {
                    this.availableColumns.push({
                        label: option[key],
                        value: key
                    });
                });
            }
        }

    }

    ngOnInit() {
    }

    onDrop(event) {
        const  value = _.map(this.displayedColumns, 'value').join(',');
        const setting = _.find(this.settings, ['id', Setting.user_table_columns]);
        this.settingsService.setSetting(Setting.user_table_columns, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            this.toastr.success(res.message);
        });
    }

}
