import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../../settings.service';



@Component({
    selector: 'app-settings-work-areas-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasMainComponent implements OnInit {

    @ViewChild(DatatableComponent) table: DatatableComponent
    @ViewChild('searchInput') search: ElementRef;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private settingsService: SettingsService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck() {
    }


}
