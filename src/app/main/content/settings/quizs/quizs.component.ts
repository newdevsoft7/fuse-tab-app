import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-quizs',
    templateUrl: './quizs.component.html',
    styleUrls: ['./quizs.component.scss']
})
export class SettingsQuizsComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
