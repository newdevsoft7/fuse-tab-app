import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { ScheduleService } from '../../../schedule.service';

@Component({
    selector: 'app-shifts-export-as-excel-dialog',
    templateUrl: './shifts-export-as-excel-dialog.component.html',
    styleUrls: ['./shifts-export-as-excel-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftsExportAsExcelDialogComponent implements OnInit {

    workareas$;
    workareas: any[] = [];

    period = {
        from: moment().format('YYYY-MM-DD'),
        to: moment().add(7, 'day').format('YYYY-MM-DD')
    };

    constructor(
        public dialogRef: MatDialogRef<ShiftsExportAsExcelDialogComponent>,
        private scheduleService: ScheduleService,
        @Inject(MAT_DIALOG_DATA) private data: any,
    ) { }

    ngOnInit() {
        this.workareas$ = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };
    }

    export() {
        this.dialogRef.close();
    }

}
