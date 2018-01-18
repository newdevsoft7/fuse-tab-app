import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile-info-add-field',
    templateUrl: './add-field.component.html',
    styleUrls: ['./add-field.component.scss']
})
export class ProfileInfoAddFieldComponent implements OnInit {
    TYPE: any[] = [
        { value: 'short', label: 'Short(40 chars)' },
        { value: 'medium', label: 'Medium(200 chars)' },
        { value: 'long', label: 'Long' },
        { value: 'list', label: 'List(single)' },
        { value: 'listm', label: 'List(multiple)' },
        { value: 'date', label: 'Date' },
        { value: 'number', label: 'Number' },
    ];

    VISIBILITY: any[] = [
        { value: 'hidden', label: 'Hidden' },
        { value: 'required', label: 'Required' },
        { value: 'pay', label: 'Required for invoice' },
        { value: 'optional', label: 'Optional' },
    ];
    
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
            ename: ['', Validators.required],
            etype: ['', Validators.required],
            visibility: ['', Validators.required]
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
            this.onFieldAdd.next(this.form.value);
            this.formActive = false;
        }
    }
}
