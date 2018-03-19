import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-settings-shift-flags',
    templateUrl: './shift-flags.component.html',
    styleUrls: ['./shift-flags.component.scss']
})
export class SettingsShiftFlagsComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    flags = [];

    flag: any;
    
    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.getFlags();
        this.resetForm();
    }

    getFlags() {
        this.settingsService.getFlags().subscribe(res => this.flags = res);
    }

    onFlagDeleted(flag) {
        const index = _.findIndex(this.flags, ['id', flag.id]);
        this.flags.splice(index, 1);
    }

    addFlag() {
        if (!this.flag.fname || !this.flag.color) return;
        this.settingsService.createFlag(this.flag).subscribe(res => {
            this.toastr.success(res.message);
            this.flags.push({ ...res.data });
            this.resetForm();
        })
    }

    resetForm() {
        this.flag = {
            fname: '',
            color: ''
        };
    }
}
