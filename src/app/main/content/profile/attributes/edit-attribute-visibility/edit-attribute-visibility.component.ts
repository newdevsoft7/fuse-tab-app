import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { PROFILE_ATTRIBUTE_VISIBILITY } from '../profile-attribute.models';
import { ProfileAttributesService } from '../profile-attributes.service';

@Component({
    selector: 'app-profile-attributes-edit-attribute-visibility',
    templateUrl: './edit-attribute-visibility.component.html',
    styleUrls: ['./edit-attribute-visibility.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProfileAttributesEditAttributeVSComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() attribute;

    VISIBILITY = PROFILE_ATTRIBUTE_VISIBILITY;

    constructor(
        private formBuilder: FormBuilder,
        private attributesService: ProfileAttributesService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            visibility: [this.attribute.visibility]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get visibility() {
        return this.VISIBILITY.find(t => t.value == this.attribute.visibility).label;
    }

    onFormSubmit() {
        console.log(this.form.value);
        if (this.form.valid) {
            const newAttribute = _.cloneDeep(this.attribute);

            newAttribute.visibility = this.form.getRawValue().visibility;
            this.attributesService.updateAttribute(newAttribute).subscribe(
                res => {
                    this.attribute.visibility = newAttribute.visibility;
                });
            this.formActive = false;
        }
    }

}
