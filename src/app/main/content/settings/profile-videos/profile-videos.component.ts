import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-profile-videos',
    templateUrl: './profile-videos.component.html',
    styleUrls: ['./profile-videos.component.scss']
})
export class SettingsProfileVideosComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
