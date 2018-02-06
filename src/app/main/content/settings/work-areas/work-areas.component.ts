import { Component, OnInit, ViewEncapsulation, Input, DoCheck, IterableDiffers } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';


import * as _ from 'lodash';


@Component({
    selector: 'app-settings-work-areas',
    templateUrl: './work-areas.component.html',
    styleUrls: ['./work-areas.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasComponent implements OnInit, DoCheck {



    constructor(
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
