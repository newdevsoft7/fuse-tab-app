import {
    Component, Input,
    OnInit, Output,
    OnDestroy, ViewEncapsulation, ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ActionService } from '../../../../../shared/services/action.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-edit-shift',
    templateUrl: './edit-shift.component.html',
    styleUrls: ['./edit-shift.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditShiftComponent implements OnInit, OnDestroy {

    @Input() data;

    shifts: any[];

    @ViewChild('table') table: DatatableComponent;

    shiftsSubscription: Subscription

    constructor(
        private actionService: ActionService
    ) {
        // For already opened tab
        this.shiftsSubscription = this.actionService.shiftsToEdit.subscribe((shifts: any[]) => {
            this.shifts = [...shifts];
        });
    }

    ngOnInit() {

        // If the tab is opened first
        this.shifts = this.data.shifts;
    }

    ngOnDestroy() {
        this.shiftsSubscription.unsubscribe();
    }

    removeShift(index) {
        this.shifts.splice(index, 1);
    }

}
