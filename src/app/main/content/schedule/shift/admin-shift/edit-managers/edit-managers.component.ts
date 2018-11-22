import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { ScheduleService } from '@main/content/schedule/schedule.service';
import { FilterService } from '@shared/services/filter.service';
import { from } from 'rxjs/observable/from';


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
        private filterService: FilterService
    ) { }

    ngOnInit() {
        this.managersObservable = (text: string): Observable<any> => {
            return from(this.filterService.getManagerFilter(text));
        };

        // Get all managers
        this.managersObservable('').subscribe(res => {
            this.managers = res;
        });
    }

    openForm() {
        this.form = this.formBuilder.group({
            manager_ids: [this.shift.managers]
        });
        this.formActive = true;
    }

    display() {
        const managers = this.shift.managers.map(m => m.name).join(', ');
        return managers === '' ? 'Empty' : managers;
    }

    saveForm() {
        if (this.form.valid) {
            const manager_ids = this.form.getRawValue().manager_ids.map(v => v.id);
            this.scheduleService.updateShift(this.shift.id, { manager_ids })
                .subscribe(res => {
                    //this.toastr.success(res.message);
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
