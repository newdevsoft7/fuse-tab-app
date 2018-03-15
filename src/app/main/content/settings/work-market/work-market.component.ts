import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-settings-work-market',
    templateUrl: './work-market.component.html',
    styleUrls: ['./work-market.component.scss']
})
export class SettingsWorkMarketComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

}
