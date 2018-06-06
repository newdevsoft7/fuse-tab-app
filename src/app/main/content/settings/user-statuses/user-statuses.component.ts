import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';
import { TokenStorage } from '../../../../shared/services/token-storage.service';

@Component({
    selector: 'app-settings-user-statuses',
    templateUrl: './user-statuses.component.html',
    styleUrls: ['./user-statuses.component.scss']
})
export class SettingsUserStatusesComponent implements OnInit {

    statuses = [];
    status: any;
    
    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage
    ) { }

    ngOnInit() {
        this.getUserStatuses();
        this.resetForm();
    }

    getUserStatuses() {
        this.settingsService.getUserStatuses().subscribe(res => this.statuses = res);
    }

    onStatusDeleted(status) {
        const index = _.findIndex(this.statuses, ['id', status.id]);
        this.statuses.splice(index, 1);
        this.syncUserStatuses();
    }

    syncUserStatuses() {
        const settings = this.tokenStorage.getSettings();
        settings.user_statuses = this.statuses.map(v => {
            return {
                id: v.id,
                sname: v.name,
                color: v.color
            };
        });
        this.tokenStorage.setSettings(settings);
    }

    onStatusUpdated(status) {
        this.syncUserStatuses();
    }

    addStatus() {
        if (!this.status.sname || !this.status.color) return;
        this.settingsService.createUserStatus(this.status).subscribe(res => {
            //this.toastr.success(res.message);
            this.statuses.push(
                {
                    ...res.data,
                    name: res.data.sname,
                    deletable: 1,
                    editable: 1,
                    color_editable: 1
                }
            );
            this.syncUserStatuses();
            this.resetForm();
        })
    }

    resetForm() {
        this.status = {
            sname: '',
            color: ''
        };
    }
}
