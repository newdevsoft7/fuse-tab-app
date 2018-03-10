import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ScheduleService } from '../../../schedule/schedule.service';

@Component({
	selector: 'app-staff-invoices-generation',
	templateUrl: './staff-invoices-generation.component.html',
    styleUrls: ['./staff-invoices-generation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffInvoicesGenerationComponent implements OnInit {

    period = {
        from: moment().subtract(7, 'day').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD') 
    };

    // Checkboxes
    isOneInvoicePerShift = false;
    isOnlyStaffCompleted = false;
    isOnlyUninvoicedExpenses = false;

    categories = [];

	constructor(
        private scheduleService: ScheduleService
    ) { }

	ngOnInit() {

    }
    
    generate() {

    }

}
