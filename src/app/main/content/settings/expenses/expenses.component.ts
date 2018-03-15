import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss']
})
export class SettingsExpensesComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
