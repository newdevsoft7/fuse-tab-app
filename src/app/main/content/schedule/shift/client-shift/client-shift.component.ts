import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTab, MatTabChangeEvent } from '@angular/material';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { ClientShiftMapComponent } from './map/map.component';

enum TAB {
    Info = 0,
    Map = 1,
    Expenses = 2,
    REPORTS_AND_UPLOADS = 3
};

@Component({
    selector: 'app-client-shift',
    templateUrl: './client-shift.component.html',
    styleUrls: ['./client-shift.component.scss']
})
export class ClientShiftComponent implements OnInit {

    @Input() data;
    shift: any;
    currentUser: any;
    showMoreBtn = true;
    timezones: any;
    managers = '';

    @ViewChild('mapTab') mapTab: ClientShiftMapComponent;

    constructor(
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private userService: UserService,
        private scheduleService: ScheduleService,
    ) { }

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();
        this.fetch();

        // Get timezones
        this.scheduleService.getTimezones()
            .subscribe(res => {
                this.timezones = res;
            });
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
        switch (event.index) {
            case TAB.Map:
                this.mapTab.refreshMap();
                break;

            default:
                break;
        }
    }


}
