import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-settings-work-areas',
    templateUrl: './work-areas.component.html',
    styleUrls: ['./work-areas.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasComponent implements OnInit {

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private settingsService: SettingsService) {
    }

    ngOnInit() {
    }

}
