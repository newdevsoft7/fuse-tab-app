import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { ScheduleService } from '../../schedule.service';

@Component({
	selector: 'app-shifts-export-as-excel',
	templateUrl: './shifts-export-as-excel.component.html',
    styleUrls: ['./shifts-export-as-excel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftsExportAsExcelComponent implements OnInit {

    workareas$;
    workareas: any[] = [];

    managers$;
    managers = [];

    categories: any[] = []; // Tracking categories and options

    period = {
        from: moment().format('YYYY-MM-DD'),
        to: moment().add(7, 'day').format('YYYY-MM-DD')
    };

    // Options
    options = [
        { label: 'Unfilled only', checked: false },
        { label: 'Include reports', checked: false },
        { label: 'Group by shift', checked: false }
    ]

    // Staff statues
    staffStatues = [
        { label: 'Selected', checked: true },
        { label: 'Checked In', checked: true },
        { label: 'Completed', checked: true },
        { label: 'Other', checked: false },
        { label: 'Confirmed', checked: true },
        { label: 'Checked Out', checked: true },
        { label: 'Invoiced', checked: true },
        { label: 'No Show', checked: false },
        { label: 'Replacement Requested', checked: true },
        { label: 'Paid', checked: true },
    ]

	constructor(
        private scheduleService: ScheduleService
    ) { }

	ngOnInit() {
        this.workareas$ = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };

        this.managers$ = (text: string): Observable<any> => {
            return this.scheduleService.getManagers(text);
        };

        this.scheduleService.getShiftsData().subscribe(res => {
            if (res.tracking) {
                this.categories = res.tracking;
                this.categories.forEach(c => {
                    c.value = [];
                });
            }
        });
    }
    
    export() {

    }

}
