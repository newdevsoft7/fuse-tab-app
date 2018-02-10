import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { TRACKING_CATEGORY_CLIENT_VISIBILITY } from '../tracking.models';
import { TrackingService } from '../tracking.service';


@Component({
    selector: 'app-tracking-edit-category-client',
    templateUrl: './edit-category-client.component.html',
    styleUrls: ['./edit-category-client.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TrackingEditCategoryClientComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    
    @Input() category;

    VISIBILITY = TRACKING_CATEGORY_CLIENT_VISIBILITY;

    constructor(
        private formBuilder: FormBuilder,
        private trackingService: TrackingService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            client_visibility: [this.category.client_visibility]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get visibility() {
        return this.VISIBILITY.find(t => t.value == this.category.client_visibility).label;
    }

    onFormSubmit() {
        if (this.form.valid) {
            const newCategory = _.cloneDeep(this.category);

            newCategory.client_visibility = this.form.getRawValue().client_visibility;
            this.trackingService.updateTrackingCategory(newCategory).subscribe(
                res => {
                    this.category.client_visibility = newCategory.client_visibility;
                });
            this.formActive = false;
        }
    }

}
