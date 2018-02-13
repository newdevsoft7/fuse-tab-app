import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PROFILE_ATTRIBUTE_ROLE, PROFILE_ATTRIBUTE_VISIBILITY } from '../profile-attribute.models';

@Component({
    selector: 'app-profile-attributes-add-attribute',
    templateUrl: './add-attribute.component.html',
    styleUrls: ['./add-attribute.component.scss']
})
export class ProfileAttributesAddAttributeComponent implements OnInit {
    
    formActive = false;
    form: FormGroup;
    @Output() onAttributeAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;

    VISIBILITY = PROFILE_ATTRIBUTE_VISIBILITY;
    ROLE = PROFILE_ATTRIBUTE_ROLE;

    constructor(
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            aname: ['', Validators.required],
            visibility: ['', Validators.required],
            role_default: [null],
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
            this.onAttributeAdd.next(this.form.value);
            this.formActive = false;
        }
    }
}
