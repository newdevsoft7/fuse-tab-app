import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ScheduleService } from '../../../../../schedule.service';

@Component({
    selector: 'app-admin-shift-edit-performance-note',
    templateUrl: './edit-performance-note.component.html',
    styleUrls: ['./edit-performance-note.component.scss']
})
export class AdminShiftEditPerformanceNoteComponent implements OnInit {

    @Input() staff;

    formActive = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() { }

    openForm() {
        this.form = this.formBuilder.group({
            performance_note: this.staff.performance_note
        });
        this.formActive = true;
    }

    async saveForm() {
        if (this.form.valid) {
            const body = {
                performance_note: this.form.getRawValue().performance_note,
            };
            try {
                const res = await this.scheduleService.updateRoleStaff(this.staff.id, body).toPromise();
                //this.toastr.success(res.message);
                this.staff.performance_note = body.performance_note;
                this.formActive = false;
            } catch (e) {
                this.formActive = false;
                this.toastr.error(e.error.message);
            }
        }
    }

    closeForm() {
        this.formActive = false;
    }

}
