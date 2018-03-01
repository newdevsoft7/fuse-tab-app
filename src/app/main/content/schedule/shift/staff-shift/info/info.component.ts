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

import { StaffStatus } from '../../../../../../constants/staff-status-id';
import { ScheduleService } from '../../../schedule.service';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import * as _ from 'lodash';

@Component({
	selector: 'app-staff-shift-info',
	templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftInfoComponent implements OnInit {

    @Input() shift;

	constructor(
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

	ngOnInit() {
	}

}
