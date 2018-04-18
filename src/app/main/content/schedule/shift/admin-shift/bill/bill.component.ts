import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';

import * as _ from 'lodash';


@Component({
    selector: 'app-admin-shift-bill',
    templateUrl: './bill.component.html',
    styleUrls: ['./bill.component.scss']
})
export class AdminShiftBillComponent implements OnInit {

    @Input() shift;

    constructor(
        private spinner: CustomLoadingService,
        private dialog: MatDialog,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
    }

}
