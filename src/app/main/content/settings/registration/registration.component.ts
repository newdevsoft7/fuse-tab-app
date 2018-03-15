import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class SettingsRegistrationComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
