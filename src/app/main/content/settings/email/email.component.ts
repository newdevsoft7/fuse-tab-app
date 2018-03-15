import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})
export class SettingsEmailComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
