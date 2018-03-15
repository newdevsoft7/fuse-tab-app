import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class SettingsLocationsComponent implements OnInit {
	
	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
