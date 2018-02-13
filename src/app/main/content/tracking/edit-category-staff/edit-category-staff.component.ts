import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { TRACKING_CATEGORY_STAFF_VISIBILITY } from '../tracking.models';
import { TrackingService } from '../tracking.service';


@Component({
    selector: 'app-tracking-edit-category-staff',
    templateUrl: './edit-category-staff.component.html',
    styleUrls: ['./edit-category-staff.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TrackingEditCategoryStaffComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() category;

    VISIBILITY = TRACKING_CATEGORY_STAFF_VISIBILITY;

    constructor(
        private formBuilder: FormBuilder,
        private trackingService: TrackingService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            staff_visibility: [this.category.staff_visibility]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get visibility() {
        return this.VISIBILITY.find(t => t.value == this.category.staff_visibility).label;
    }

    onFormSubmit() {
        if (this.form.valid) {
            const newCategory = _.cloneDeep(this.category);

            newCategory.staff_visibility = this.form.getRawValue().staff_visibility;
            this.trackingService.updateTrackingCategory(newCategory).subscribe(
                res => {
                    this.category.staff_visibility = newCategory.staff_visibility;
                });
            this.formActive = false;
        }
    }

}
