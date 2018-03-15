import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class SettingsTrackingComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
