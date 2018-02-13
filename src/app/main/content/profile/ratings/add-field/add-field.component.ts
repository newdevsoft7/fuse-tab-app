import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile-ratings-add-field',
    templateUrl: './add-field.component.html',
    styleUrls: ['./add-field.component.scss']
})
export class ProfileRatingsAddFieldComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Output() onFieldAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {

    }

    openForm() {
        this.form = this.formBuilder.group({
            rname: ['']
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
            this.onFieldAdd.next(this.form.getRawValue().rname);
            this.formActive = false;
        }
    }


}
