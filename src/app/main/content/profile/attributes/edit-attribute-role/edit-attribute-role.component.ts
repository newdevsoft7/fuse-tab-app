import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { PROFILE_ATTRIBUTE_ROLE } from '../profile-attribute.models';
import { ProfileAttributesService } from '../profile-attributes.service';

@Component({
    selector: 'app-profile-attributes-edit-attribute-role',
    templateUrl: './edit-attribute-role.component.html',
    styleUrls: ['./edit-attribute-role.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileAttributesEditAttributeRoleComponent implements OnInit {

    ROLE = PROFILE_ATTRIBUTE_ROLE;
    formActive = false;
    form: FormGroup;
    @Input() attribute;

    constructor(
        private formBuilder: FormBuilder,
        private attributesService: ProfileAttributesService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            role_default: [this.attribute.role_default]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get role() {
        return this.ROLE.find(t => t.value == this.attribute.role_default) ? 
            this.ROLE.find(t => t.value == this.attribute.role_default).label : 'Any';
    }
    

    onFormSubmit() {
        if (this.form.valid) {
            const newAttribute = _.cloneDeep(this.attribute);
            newAttribute.role_default = this.form.getRawValue().role_default;
            console.log(newAttribute);
            this.attributesService.updateAttribute(newAttribute)
                .subscribe(res => {
                    this.attribute.role_default = newAttribute.role_default; 
                });
            this.formActive = false;
        }
    }
}
