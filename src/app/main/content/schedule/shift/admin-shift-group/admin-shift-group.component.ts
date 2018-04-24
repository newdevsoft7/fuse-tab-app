import { Component, OnInit, Input } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../../schedule.service';

@Component({
    selector: 'app-admin-shift-group',
    templateUrl: './admin-shift-group.component.html',
    styleUrls: ['./admin-shift-group.component.scss']
})
export class AdminShiftGroupComponent implements OnInit {

    @Input() data;
    group: any;
    shifts: any[] = [];
    clients: any[] = [];
    shiftData: any; // For edit tracking & work areas

    showMoreBtn = true;

    constructor(
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private scheduleService: ScheduleService
    ) {
    }
    
    ngOnInit() {
        this.fetchGroup();

        // Get Tracking Categories & Options
        this.scheduleService.getShiftsData().subscribe(res => {
            this.shiftData = res;
        });

        // Get Clients
        this.scheduleService.getClients('').subscribe(res => {
            this.clients = res;
        });
    }

    async fetchGroup() {
        try {
            this.spinner.show();
            const res = await this.scheduleService.getShiftGroup(this.data.id);
            this.group = res.group;
            this.shifts = res.shifts;
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            this.displayError(e);
        }
    }

    async toggleLive() {
        const live = this.group.live === 1 ? 0 : 1;
        try {
            const res = await this.scheduleService.updateShiftGroup(this.group.id, { live });
            this.toastr.success(res.message);
            this.group.live = live;
        } catch (e) {
            this.displayError(e);
        }
    }

    async toggleFlag(flag) {
        const value = flag.set === 1 ? 0 : 1;
        try {
            const res = await this.scheduleService.setGroupFlag(this.group.id, flag.id, value);
            this.toastr.success(res.message);
            flag.set = value;
        } catch (e) {
            this.displayError(e);
        }
    }

    async toggleLock() {
        const locked = this.group.locked === 1 ? 0 : 1;
        try {
            const res = await this.scheduleService.updateShiftGroup(this.group.id, { locked });
            this.toastr.success(res.message);
            this.group.locked = locked;
        } catch (e) {
            this.displayError(e);
        }
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
