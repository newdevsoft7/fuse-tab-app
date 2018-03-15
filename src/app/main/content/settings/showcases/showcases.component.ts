import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-showcases',
    templateUrl: './showcases.component.html',
    styleUrls: ['./showcases.component.scss']
})
export class SettingsShowcasesComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
