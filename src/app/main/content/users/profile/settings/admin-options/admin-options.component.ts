import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { UserService } from '../../../user.service';

@Component({
    selector: 'app-users-settings-admin-options',
    templateUrl: './admin-options.component.html',
    styleUrls: ['./admin-options.component.scss']
})
export class UsersSettingsAdminOptionsComponent implements OnInit, OnChanges {
    @Input() userOptions;
    @Input() user;
    @Input() timezones: any[];
    timezone: any;

    @Output() optionChanged = new EventEmitter();

    constructor(
        private toastr: ToastrService,
        private userService: UserService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user && changes.user.currentValue) {
            this.timezone = _.clone(this.user.php_tz);
        }
    }

    async onTimezoneChange(value) {
        try {
            await this.userService.updateUser(this.user.id, {php_tz: value });
            this.user.php_tz = value;
        } catch (e) {
            this.displayError(e);
        }
    }

    toggleOption(option, event) {
        console.log(this.userOptions);
        this.userOptions[option].set=event.checked;
        this.optionChanged.emit({ oname: option, set: event.checked ? 1 : 0 });
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }
}