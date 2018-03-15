import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-profile-documents',
    templateUrl: './profile-documents.component.html',
    styleUrls: ['./profile-documents.component.scss']
})
export class SettingsProfileDocumentsComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
