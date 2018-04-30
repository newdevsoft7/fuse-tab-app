import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { ScheduleService } from '../../../../../schedule.service';

@Component({
    selector: 'app-admin-shift-edit-break',
    templateUrl: './edit-break.component.html',
    styleUrls: ['./edit-break.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftEditBreakComponent implements OnInit {

    formActive = false;
    form: FormGroup;

    @Input() editable;

    @Input() staff;

    constructor(
        private formBuilder: FormBuilder,
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        
    }

    openForm() {
        this.form = this.formBuilder.group({
            paid_break: [this.staff.paid_break !== null ? this.staff.paid_break : 0],
            unpaid_break: [this.staff.unpaid_break !== null ? this.staff.unpaid_break : 0]
        });
        this.formActive = true;
    }

    saveForm() {
        const body = this.form.value;
        this.scheduleService.updateRoleStaff(this.staff.id, body)
            .subscribe(res => {
                this.toastr.success(res.message);
                this.staff.unpaid_break = body.unpaid_break;
                this.staff.paid_break = body.paid_break;
            }, err => {
                this.displayError(err);
            });
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
