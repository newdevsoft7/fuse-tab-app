import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ProfileAttributesService } from '../profile-attributes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profile-attributes-edit-category-name',
    templateUrl: './edit-category-name.component.html',
    styleUrls: ['./edit-category-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileAttributesEditCategoryNameComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() category;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private attributesService: ProfileAttributesService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            cname: [this.category.cname]
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
            const newCategory = _.cloneDeep(this.category);
            newCategory.cname = this.form.getRawValue().cname;
            this.attributesService.updateCategory(newCategory).subscribe(
                res => {
                    const category = res.data;
                    this.category.cname = category.cname;
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
