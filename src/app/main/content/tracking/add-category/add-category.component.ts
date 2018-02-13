import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TRACKING_CATEGORY_STAFF_VISIBILITY, TRACKING_CATEGORY_CLIENT_VISIBILITY } from '../tracking.models';

@Component({
    selector: 'app-tracking-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class TrackingAddCategoryComponent implements OnInit {

    STAFF_VISIBILITY = TRACKING_CATEGORY_STAFF_VISIBILITY;
    CLIENT_VISIBILITY = TRACKING_CATEGORY_CLIENT_VISIBILITY;

    formActive = false;
    form: FormGroup;
    @Output() onCategoryAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            cname: ['', Validators.required],
            staff_visibility: ['', Validators.required],
            client_visibility:['', Validators.required],
            required:['']
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
            this.onCategoryAdd.next(this.form.value);
            this.formActive = false;
        }
    }
}
