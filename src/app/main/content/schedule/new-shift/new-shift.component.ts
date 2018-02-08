import { Component, OnInit, ViewEncapsulation, Input, IterableDiffers } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';


@Component({
    selector: 'app-schedule-new-shift',
    templateUrl: './new-shift.component.html',
    styleUrls: ['./new-shift.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScheduleNewShiftComponent implements OnInit {

    shiftForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,        
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
        
    }

    ngOnInit() {
  
    }


}
