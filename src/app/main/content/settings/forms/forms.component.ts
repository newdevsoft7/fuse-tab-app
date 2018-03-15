import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class SettingsFormsComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
