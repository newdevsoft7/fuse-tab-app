import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.scss']
})
export class SettingsSystemComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
