import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { FilterService } from '@shared/services/filter.service';
import { ScheduleService } from '@main/content/schedule/schedule.service';
import { from } from 'rxjs/observable/from';


@Component({
    selector: 'app-shifts-export-as-pdf-dialog',
    templateUrl: './shifts-export-as-pdf-dialog.component.html',
    styleUrls: ['./shifts-export-as-pdf-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftsExportAsPdfDialogComponent implements OnInit {

    workareas$;
    workareas: any[] = [];

    period = {
        from: moment().format('YYYY-MM-DD'),
        to: moment().add(7, 'day').format('YYYY-MM-DD')
    };

    orientation = ['portrait'];

    constructor(
        public dialogRef: MatDialogRef<ShiftsExportAsPdfDialogComponent>,
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
