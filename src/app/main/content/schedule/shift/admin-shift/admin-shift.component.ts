import { Component, OnInit, Input } from '@angular/core';
import { TokenStorage } from '../../../../../shared/authentication/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-admin-shift',
	templateUrl: './admin-shift.component.html',
	styleUrls: ['./admin-shift.component.scss']
})
export class AdminShiftComponent implements OnInit {

	@Input() data;

	get id() {
		return this.data.id;
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

	private async fetch() {
		try {
			this.shift = await this.scheduleService.getShift(this.id);
		} catch (e) {
			this.toastr.error(e.message || 'Something is wrong while fetching events.');
		}
	}

}
