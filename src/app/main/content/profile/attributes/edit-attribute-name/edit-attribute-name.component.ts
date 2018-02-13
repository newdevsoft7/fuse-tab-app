import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ProfileAttributesService } from '../profile-attributes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profile-attributes-edit-attribute-name',
    templateUrl: './edit-attribute-name.component.html',
    styleUrls: ['./edit-attribute-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileAttributesEditAttributeNameComponent implements OnInit {

    formActive = false; 
    form: FormGroup;
    @Input() attribute;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private attributesService: ProfileAttributesService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            aname: [this.attribute.aname]
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
            const newAttribute = _.cloneDeep(this.attribute);
            newAttribute.aname = this.form.getRawValue().aname;
            this.attributesService.updateAttribute(newAttribute).subscribe(
                res => {
                    const attribute = res.data;
                    this.attribute.aname = attribute.aname;
                },
                err => {
                    const errors = err.error.errors;
                    Object.keys(errors).forEach(v => {
                        this.toastr.error(errors[v]);
                    });
                });
            this.formActive = false;
        }
    }
}
