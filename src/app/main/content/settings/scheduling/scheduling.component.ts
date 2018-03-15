import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss']
})
export class SettingsSchedulingComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
