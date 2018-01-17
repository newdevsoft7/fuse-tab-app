import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileInfoService } from '../profile-info.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-profile-info-edit-category-name',
    templateUrl: './edit-category-name.component.html',
    styleUrls: ['./edit-category-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditCategoryNameComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() category;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private profileInfoService: ProfileInfoService) { }

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
            this.profileInfoService.updateCategory(newCategory)
                .subscribe(res => {
                    const category = res.data;
                    this.category.cname = category.cname;
                });
            this.formActive = false;
        }
    }

}
