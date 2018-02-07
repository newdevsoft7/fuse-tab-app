import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ProfileRatingsService } from '../profile-ratings.service';


@Component({
    selector: 'app-profile-ratings-edit-field-name',
    templateUrl: './edit-field-name.component.html',
    styleUrls: ['./edit-category-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileRatingsEditFieldNameComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() rating;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private ratingsService: ProfileRatingsService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            rname: [this.rating.cname]
        });
        this.formActive = true;
        this.focusNameField();
    }

    closeForm() {
        this.formActive = false;
    }

    focusNameField() {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    onFormSubmit() {
        if (this.form.valid) {
            const newRating = _.cloneDeep(this.rating);
            newRating.rname = this.form.getRawValue().rname;
            this.ratingsService.updateRating(newRating.id, newRating)
                .subscribe(res => {
                    const rating = res.data;
                    this.rating.rname = rating.rname;
                });
            this.formActive = false;
        }
    }

}
