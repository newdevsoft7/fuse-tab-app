import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTab, MatTabChangeEvent } from '@angular/material';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { StaffShiftMapComponent } from './map/map.component';
import { TabService } from '../../../../tab/tab.service';

enum TAB {
    Info = 'Info',
    Map = 'Map',
    Expenses = 'Expenses',
    Reports = 'Reports & Uploads'
}

@Component({
    selector: 'app-staff-shift',
    templateUrl: './staff-shift.component.html',
    styleUrls: ['./staff-shift.component.scss']
})
export class StaffShiftComponent implements OnInit {

    @Input() data;
    shift: any;
    currentUser: any;
    showMoreBtn = true;
    timezones: any;
    managers = '';
    settings: any;

    @ViewChild('mapTab') mapTab: StaffShiftMapComponent;

    constructor(
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private userService: UserService,
        private scheduleService: ScheduleService,
        private tabService: TabService
    ) {
        this.settings = this.tokenStorage.getSettings();
    }

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();

        this.fetch();

        // Get timezones
        this.scheduleService.getTimezones()
            .subscribe(res => {
                this.timezones = res;
            });

        if (window.addEventListener) {
            window.addEventListener('message', this.onMessage.bind(this), false);
        } else if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
        }
    }

    // Get a shift
    private async fetch() {
        try {
            this.shift = await this.scheduleService.getShift(this.data.id);
            this.managers = this.shift.managers.map(m => m.name).join(', ')
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong while fetching events.');
        }
    }

    

    toggleMoreBtn() {
        this.showMoreBtn = !this.showMoreBtn;
    }

    selectedTabChange(event: MatTabChangeEvent) {
        switch (event.tab.textLabel) {
            case TAB.Map:
                this.mapTab.refreshMap();
                break;

            default:
                break;
        }
    }

    onMessage(event: any) {
        if (event.data && event.data.func && event.data.message === 'success') {
            const id = this.tabService.currentTab.data.id;
            if (this.tabService.currentTab.url === `form_apply/${this.shift.id}/${id}`) {
                const index = this.shift.forms_apply.findIndex(form => form.id === this.tabService.currentTab.data.id);
                if (index > -1) {
                    this.shift.forms_apply.splice(index, 1);
                }
            } else if (this.tabService.currentTab.url === `form_confirm/${this.shift.id}/${id}`) {
                const index = this.shift.forms_confirm.findIndex(form => form.id === this.tabService.currentTab.data.id);
                if (index > -1) {
                    this.shift.forms_confirm.splice(index, 1);
                }
            }
            this.tabService.closeTab(this.tabService.currentTab.url);
        }
    }
}
