import { Component, OnInit, ViewEncapsulation, Input, DoCheck, IterableDiffers } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';

import * as _ from 'lodash';


@Component({
    selector: 'app-admin-shift-castings',
    templateUrl: './castings.component.html',
    styleUrls: ['./castings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftCastingsComponent implements OnInit, DoCheck {

    @Input() shift;

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
