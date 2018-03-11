import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { ScheduleService } from '../../schedule.service';

@Component({
    selector: 'app-shifts-export-as-pdf',
    templateUrl: './shifts-export-as-pdf.component.html',
    styleUrls: ['./shifts-export-as-pdf.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftsExportAsPdfComponent implements OnInit {

    workareas$;
    workareas: any[] = [];

    managers$;
    managers = [];

    categories: any[] = []; // Tracking categories and options

    period = {
        from: moment().format('YYYY-MM-DD'),
        to: moment().add(7, 'day').format('YYYY-MM-DD')
    };

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
        // TODO
    }

}
