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
    selector: 'app-group-edit-managers',
    templateUrl: './edit-managers.component.html',
    styleUrls: ['./edit-managers.component.scss']
})
export class GroupEditManagersComponent implements OnInit {

    formActive = false;
    form: FormGroup;

    managersObservable; // Observable for multi-select

    managers = [];

    @Input() group;

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
            manager_ids: [this.group.managers.map(m => m.id)]
        });
        this.formActive = true;
    }

    display() {
        const managers = this.group.managers.map(m => m.name).join(', ');
        return managers === '' ? 'Empty' : managers;
    }

    async saveForm() {
        if (this.form.valid) {
            const manager_ids = this.form.getRawValue().manager_ids;
            try {
                const res = await this.scheduleService.updateShiftGroup(this.group.id, { manager_ids });
                this.toastr.success(res.message);
                this.group.managers = this.managers.filter(m => manager_ids.includes(m.id)).map(v => {
                    return { id: v.id, name: v.name }
                });
            } catch (e) {
                this.displayError(e);
            }
            this.formActive = false;
        }
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
