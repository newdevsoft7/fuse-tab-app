import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-pay-levels',
    templateUrl: './pay-levels.component.html',
    styleUrls: ['./pay-levels.component.scss']
})
export class SettingsPayLevelsComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
