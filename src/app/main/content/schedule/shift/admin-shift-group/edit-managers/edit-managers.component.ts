import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { ScheduleService } from '../../../schedule.service';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';
import { FilterService } from '@shared/services/filter.service';
import { from } from 'rxjs/observable/from';

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
        private scMessageService: SCMessageService,
        private filterService: FilterService
    ) { }

    ngOnInit() {
        this.managersObservable = (text: string): Observable<any> => {
            return from(this.filterService.getManagerFilter(text));
        };

        // Get all managers
        this.managersObservable('').subscribe(res => {
            this.managers = res;
        })
    }

    openForm() {
        this.form = this.formBuilder.group({
            manager_ids: [this.group.managers]
        });
        this.formActive = true;
    }

    display() {
        const managers = this.group.managers.map(m => m.name).join(', ');
        return managers === '' ? 'Empty' : managers;
    }

    async saveForm() {
        if (this.form.valid) {
            const manager_ids = this.form.getRawValue().manager_ids.map(v => v.id);
            try {
                //this.toastr.success(res.message);
                this.group.managers = this.managers.filter(m => manager_ids.includes(m.id)).map(v => {
                    return { id: v.id, name: v.name }
                });
            } catch (e) {
                this.scMessageService.error(e);
            }
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

}
