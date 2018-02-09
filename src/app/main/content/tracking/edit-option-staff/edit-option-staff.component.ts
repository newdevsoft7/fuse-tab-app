import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { TRACKING_OPTION_STAFF_VISIBILITY } from '../tracking.models';
import { TrackingService } from '../tracking.service';


@Component({
    selector: 'app-tracking-edit-option-staff',
    templateUrl: './edit-option-staff.component.html',
    styleUrls: ['./edit-option-staff.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TrackingEditOptionStaffComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() option;

    VISIBILITY = TRACKING_OPTION_STAFF_VISIBILITY;

    constructor(
        private formBuilder: FormBuilder,
        private trackingService: TrackingService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            staff_visibility: [this.option.staff_visibility]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get visibility() {
        return this.VISIBILITY.find(t => t.value == this.option.staff_visibility).label;
    }

    onFormSubmit() {
        if (this.form.valid) {
            const newOption = _.cloneDeep(this.option);

            newOption.staff_visibility = this.form.getRawValue().staff_visibility;
            this.trackingService.updateTrackingOption(newOption).subscribe(
                res => {
                    this.option.staff_visibility = newOption.staff_visibility;
                });
            this.formActive = false;
        }
    }

}
