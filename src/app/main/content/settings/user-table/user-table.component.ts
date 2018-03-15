import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-settings-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss']
})
export class SettingsUserTableComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    @Output() settingsChange = new EventEmitter();
    
    constructor() { }

    ngOnInit() {
    }

}
