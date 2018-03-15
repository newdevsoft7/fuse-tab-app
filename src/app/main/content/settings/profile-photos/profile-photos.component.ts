import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-profile-photos',
    templateUrl: './profile-photos.component.html',
    styleUrls: ['./profile-photos.component.scss']
})
export class SettingsProfilePhotosComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
