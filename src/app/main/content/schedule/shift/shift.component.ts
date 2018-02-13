import { Component, OnInit, Input } from '@angular/core';
import { TokenStorage } from '../../../../shared/authentication/token-storage.service';
import { ScheduleService } from '../schedule.service';



@Component({
	selector: 'app-schedule-shift',
	templateUrl: './shift.component.html',
	styleUrls: ['./shift.component.scss']
})
export class ScheduleShiftComponent implements OnInit {

	currentUser: any;
	value = 1;
	constructor(
		private tokenStorage: TokenStorage,
		private userService: ScheduleService
	) { }

	ngOnInit() {
		this.currentUser = this.tokenStorage.getUser();
	}

}
