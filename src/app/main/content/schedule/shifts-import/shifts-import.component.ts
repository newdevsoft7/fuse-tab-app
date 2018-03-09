import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as _ from 'lodash';
import { fuseAnimations } from '../../../../core/animations';

import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../schedule.service';

@Component({
    selector: 'app-shifts-import',
    templateUrl: './shifts-import.component.html',
    styleUrls: ['./shifts-import.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ShiftsImportComponent implements OnInit {

    shifts: any[] = [];

    constructor(
        private loadingService: CustomLoadingService,
        private toastr: ToastrService,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() {
    }

    uploadShifts(event) {
        const files = event.target.files;
        if (files && files.length > 0) {

            // Validate file extension
            const valid = _.every(files, (file) => {
                return [
                    'csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel'
                ].includes(file.type);
            });

            if (!valid) {
                this.toastr.error('File type should be one of .csv, .xls, .xlsx');
                return;
            }

            this.loadingService.showLoadingSpinner();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('shift[]', files[i], files[i].name);
            }

            // this.scheduleService.importShifts(formData)
            //     .subscribe(res => {
            //         this.loadingService.hideLoadingSpinner();
            //         this.toastr.success(res.message);
            //         res.data.map(shift => {
            //             this.shifts.push(shift);
            //         });
            //     }, err => {
            //         this.loadingService.hideLoadingSpinner();
            //         // TODO - Error Message
            //     });
        }
    }

}
