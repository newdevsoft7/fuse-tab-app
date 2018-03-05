import {
	Component, OnInit,
	ViewEncapsulation, ViewChild,
	ElementRef, Input
} from '@angular/core';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { fuseAnimations } from '../../../../core/animations';

import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { ScheduleService } from '../schedule.service';

const DEFAULT_PAGE_SIZE = 50;

@Component({
	selector: 'app-shift-list',
	templateUrl: './shift-list.component.html',
    styleUrls: ['./shift-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ShiftListComponent implements OnInit {

    shifts;

    pageNumber: number;
    pageSize = DEFAULT_PAGE_SIZE;
    total: number;
    pageLengths = [10, 25, 50, 100, 200, 300];

	constructor(
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private scheduleService: ScheduleService
    ) { 
    }

	ngOnInit() {
	}

}
