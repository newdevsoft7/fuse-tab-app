import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-settings-client-invoices',
    templateUrl: './client-invoices.component.html',
    styleUrls: ['./client-invoices.component.scss']
})
export class  SettingsClientInvoicesComponent implements OnInit {

	@Input() settings = [];
    @Input() options = [];

    constructor() { }

    ngOnInit() {
    }

}
