import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-shift-edit-managers',
    templateUrl: './edit-managers.component.html',
    styleUrls: ['./edit-managers.component.scss']
})
export class AdminShiftEditManagersComponent implements OnInit {

    formActive = false;
    form: FormGroup;

    managersObservable; // Observable for multi-select

    managers = [];

    @Input() shift;
    @Output() onManagersChanged = new EventEmitter;
    constructor(
        private formBuilder: FormBuilder,
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.managersObservable = (text: string): Observable<any> => {
            return this.scheduleService.getManagers(text);
        };

        // Get all managers
        this.managersObservable('').subscribe(res => {
            this.managers = res;
        })
    }

    openForm() {
        this.form = this.formBuilder.group({
            manager_ids: [this.shift.managers.map(m => m.id)]
        });
        this.formActive = true;
    }

    display() {
        const managers = this.shift.managers.map(m => m.name).join(', ');
        return managers === '' ? 'Empty' : managers;
    }

    saveForm() {
        if (this.form.valid) {
            const manager_ids = this.form.getRawValue().manager_ids;
            this.scheduleService.updateShift(this.shift.id, { manager_ids })
                .subscribe(res => {
                    this.toastr.success(res.message);
                    const managers = this.managers.filter(m => manager_ids.includes(m.id)).map(v =>  { 
                        return { id: v.id, name: v.name } 
                    });
                    this.onManagersChanged.next(managers);
                })
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

}
