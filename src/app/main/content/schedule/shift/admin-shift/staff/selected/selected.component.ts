import { Component, OnInit, ViewEncapsulation, Input, DoCheck, IterableDiffers } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';

import * as _ from 'lodash';


@Component({
    selector: 'app-admin-shift-staff-selected',
    templateUrl: './selected.component.html',
    styleUrls: ['./selected.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffSelectedComponent implements OnInit, DoCheck {

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
