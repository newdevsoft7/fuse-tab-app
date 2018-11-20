import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { FilterService } from '@shared/services/filter.service';
import { ScheduleService } from '@main/content/schedule/schedule.service';
import { from } from 'rxjs/observable/from';

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
        private filterService: FilterService,
        @Inject(MAT_DIALOG_DATA) private data: any,
    ) { }

    ngOnInit() {
        this.workareas$ = (text: string): Observable<any> => {
            return from(this.filterService.getWorkAreaFilter(text));
        };
    }

    export() {
        this.dialogRef.close();
    }

}
