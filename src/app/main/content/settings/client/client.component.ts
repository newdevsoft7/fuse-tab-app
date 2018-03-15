import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class SettingsClientComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
