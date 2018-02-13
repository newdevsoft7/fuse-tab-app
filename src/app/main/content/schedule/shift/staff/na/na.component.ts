import { Component, OnInit, ViewEncapsulation, Input, DoCheck, IterableDiffers } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../shared/custom-loading.service';

import * as _ from 'lodash';


@Component({
    selector: 'app-schedule-shift-staff-na',
    templateUrl: './na.component.html',
    styleUrls: ['./na.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScheduleShiftStaffNAComponent implements OnInit, DoCheck {



    constructor(
        private loadingService: CustomLoadingService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck() {
    }


}
