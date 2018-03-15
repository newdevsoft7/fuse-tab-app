import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class SettingsStaffComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
