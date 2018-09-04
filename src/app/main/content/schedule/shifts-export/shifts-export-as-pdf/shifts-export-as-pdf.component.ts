import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { ScheduleService } from '../../schedule.service';

@Component({
    selector: 'app-shifts-export-as-pdf',
    templateUrl: './shifts-export-as-pdf.component.html',
    styleUrls: ['./shifts-export-as-pdf.component.scss']
})
export class ShiftsExportAsPdfComponent implements OnInit {

    shifts: any[] = [];
    constructor(
    ) {
        _.times(15, (n) => {
            this.shifts.push({
                date: '2018-09-01',
                title: 'Sample shift',
                staffs: [
                    {
                        ppic: '/assets/images/avatars/female_tthumb.jpg',
                        time: '2:00 pm - 6:00 pm',
                        timeIn: '2:00 pm',
                        timeOut: '6:00 pm',
                        total: 5,
                        role: 'Mascot',
                        name: 'Alexander Pavlov',
                        signature: '',
                    },
                    {
                        ppic: '/assets/images/avatars/female_tthumb.jpg',
                        time: '2:00 pm - 6:00 pm',
                        timeIn: '2:00 pm',
                        timeOut: '6:00 pm',
                        total: 2,
                        role: 'Minder',
                        name: 'Cristiano Ronaldo',
                        signature: '',
                    },
                    {
                        ppic: '/assets/images/avatars/female_tthumb.jpg',
                        time: '2:00 pm - 6:00 pm',
                        timeIn: '2:00 pm',
                        timeOut: '6:00 pm',
                        total: 5,
                        role: 'Mascot',
                        name: 'Gareth Bale',
                        signature: '',
                    }
                ]
            });
        });
    }

    ngOnInit() {
    }

}
