import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TRACKING_OPTION_STAFF_VISIBILITY } from '../tracking.models';

@Component({
    selector: 'app-tracking-add-option',
    templateUrl: './add-option.component.html',
    styleUrls: ['./add-option.component.scss']
})
export class TrackingAddOptionComponent implements OnInit {

    STAFF_VISIBILITY = TRACKING_OPTION_STAFF_VISIBILITY;

    formActive = false;
    form: FormGroup;
    @Output() onOptionAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;


    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {

    }

    openForm() {
        this.form = this.formBuilder.group({
            oname: ['', Validators.required],
            staff_visibility: ['', Validators.required],
            active:['']
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
            this.onOptionAdd.next(this.form.value);
            this.formActive = false;
        }
    }


}
