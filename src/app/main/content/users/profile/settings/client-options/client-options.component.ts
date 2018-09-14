import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import { UserService } from '../../../user.service';
import * as _ from 'lodash';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-users-settings-client-options',
    templateUrl: './client-options.component.html',
    styleUrls: ['./client-options.component.scss']
})
export class UsersSettingsClientOptionsComponent implements OnInit, OnChanges {

    @Input() userOptions;
    @Input() user;
    @Input() timezones: any[];
    timezone: any;
    
    @Output() optionChanged = new EventEmitter();

    constructor(
        private userService: UserService,
        private scMessageService: SCMessageService
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
            this.scMessageService.error(e);
        }
    }

    toggleOption(option, event) {
        this.userOptions[option].set=event.checked;
        this.optionChanged.emit({ oname: option, set: event.checked ? 1 : 0 });
    }

}