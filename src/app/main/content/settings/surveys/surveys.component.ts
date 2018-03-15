import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-surveys',
    templateUrl: './surveys.component.html',
    styleUrls: ['./surveys.component.scss']
})
export class SettingsSurveysComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
