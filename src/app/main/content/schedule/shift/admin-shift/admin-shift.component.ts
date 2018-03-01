import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTab, MatTabChangeEvent } from '@angular/material';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { ToastrService } from 'ngx-toastr';
import { AdminShiftMapComponent } from './map/map.component';
import { AdminShiftStaffComponent } from './staff/staff.component';

import * as _ from 'lodash';

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

	showMoreBtn = true;

	get id() {
		return this.data.id;
	}

	get url() {
		return this.data.url;
	}
	
	currentUser: any;
	shift: any;
	timezones = [];
	notes; // For Shift notes tab

	constructor(
		private tokenStorage: TokenStorage,
		private toastr: ToastrService,
		private userService: UserService,
		private scheduleService: ScheduleService
	) { }

	ngOnInit() {
		this.currentUser = this.tokenStorage.getUser();
		this.fetch();

		this.scheduleService.getTimezones()
			.subscribe(res => {
				Object.keys(res).forEach(key => {
					this.timezones.push({ value: key, label: res[key] });
				});
			});

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

	toggleFlag(flag) {
		const value = flag.set === 1 ? 0 : 1;
		this.scheduleService.setShiftFlag(this.shift.id, flag.id, value)
			.subscribe(res => {
				flag.set = value;
			});
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

	saveNotes(notes) {
		this.scheduleService.updateShift(this.shift.id, { notes })
			.subscribe(res => {
				this.toastr.success(res.message);
				this.shift.notes = _.clone(this.notes);
			}, err => {
				this.notes = _.clone(this.shift.notes);
			});
	}

	onAddressChanged(address) {
		this.shift.address = address;
	}

	onContactChanged(contact) {
		this.shift.contact = contact;
	}

	onGenericLocationChanged(genericLocation) {
		this.shift.generic_location = genericLocation;
	}

	onGenericTitleChanged(genericTitle) {
		this.shift.generic_title = genericTitle;
	}

	onTitleChanged(title) {
		this.shift.title = title;
	}

	onPeriodChanged({ start, end, timezone }) {
		this.shift.shift_start = start;
		this.shift.shift_end = end;
		this.shift.timezone= timezone;
	}

	onManagersChanged(managers: any[]) {
		this.shift.managers = managers;
	}


	private async fetch() {
		try {
			this.shift = await this.scheduleService.getShift(this.id);
			this.notes = _.clone(this.shift.notes);
		} catch (e) {
			this.toastr.error(e.message || 'Something is wrong while fetching events.');
		}
	}

}
