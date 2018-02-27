import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTab, MatTabChangeEvent } from '@angular/material';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { ToastrService } from 'ngx-toastr';
import { AdminShiftMapComponent } from './map/map.component';
import { AdminShiftStaffComponent } from './staff/staff.component';

export enum TAB {
	Staff = 0,
	Expenses = 1,
	Tracking = 2,
	Reports = 3,
	Casting = 4,
	Map = 5
};

@Component({
	selector: 'app-admin-shift',
	templateUrl: './admin-shift.component.html',
	styleUrls: ['./admin-shift.component.scss']
})
export class AdminShiftComponent implements OnInit {

	@Input() data;
	@ViewChild('staffTab') staffTab: AdminShiftStaffComponent;
	@ViewChild('mapTab') mapTab: AdminShiftMapComponent;

	get id() {
		return this.data.id;
	}

	get url() {
		return this.data.url;
	}
	
	currentUser: any;
	shift: any;

	constructor(
		private tokenStorage: TokenStorage,
		private toastr: ToastrService,
		private userService: UserService,
		private scheduleService: ScheduleService
	) { }

	ngOnInit() {
		this.currentUser = this.tokenStorage.getUser();
		this.fetch();
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

	toggleLive() {
		const live = this.shift.live === 1 ? 0 : 1;
		this.scheduleService.publishShift(this.shift.id, live)
			.subscribe(res => {
				this.shift.live = live;
				this.toastr.success(res.message);
			});
	}

	toggleLock() {
		const lock = this.shift.locked === 1 ? 0 : 1;
		this.scheduleService.lockShift(this.shift.id, lock)
			.subscribe(res => {
				this.shift.locked = lock;
				this.toastr.success(res.message);
			});
	}


	private async fetch() {
		try {
			this.shift = await this.scheduleService.getShift(this.id);
		} catch (e) {
			this.toastr.error(e.message || 'Something is wrong while fetching events.');
		}
	}

}
