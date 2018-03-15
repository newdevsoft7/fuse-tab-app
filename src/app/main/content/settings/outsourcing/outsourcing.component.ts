import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-outsourcing',
    templateUrl: './outsourcing.component.html',
    styleUrls: ['./outsourcing.component.scss']
})
export class SettingsOutsourcingComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
