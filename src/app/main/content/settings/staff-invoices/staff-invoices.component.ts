import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-staff-invoices',
    templateUrl: './staff-invoices.component.html',
    styleUrls: ['./staff-invoices.component.scss']
})
export class SettingsStaffInvoicesComponent implements OnInit {

	@Input() settings = [];
	@Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
