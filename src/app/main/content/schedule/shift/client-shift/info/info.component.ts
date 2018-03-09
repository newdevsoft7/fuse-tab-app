import {
    Component, OnInit,
    ViewEncapsulation, Input,
    DoCheck, IterableDiffers,
    ViewChild
} from '@angular/core';

import {
    MatDialog, MatDialogRef,
    MAT_DIALOG_DATA,
    MatTabChangeEvent
} from '@angular/material';

import { ToastrService } from 'ngx-toastr';

import { ScheduleService } from '../../../schedule.service';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import * as _ from 'lodash';

@Component({
	selector: 'app-client-shift-info',
	templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientShiftInfoComponent implements OnInit {

    @Input() shift;

    dialogRef: any;

	constructor(
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

	ngOnInit() {
    }

    readonly files = [
        { type: 'document', name: 'work', size: '1.2 MB', created_at: 'June 8, 2018' },
        { type: 'spreadsheet', name: 'tax', size: '1.9 MB', created_at: 'June 8, 2018' },
        { type: 'spreadsheet', name: 'offer', size: '45 MB', created_at: 'June 8, 2018' },
        { type: 'document', name: 'work', size: '1.8 Mb', created_at: 'June 8, 2018' },
        { type: 'spreadsheet', name: 'intro', size: '3.2 Mb', created_at: 'June 8, 2018' },
        { type: 'document', name: 'work', size: '22 Mb', created_at: 'June 8, 2018' }
    ]

    uploadFiles(event) {
        // TODO
    }
}
