import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-settings-work-areas-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class SettingsWorkAreasAddCategoryComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Output() onCategoryAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {

    }

    openForm() {
        this.form = this.formBuilder.group({
            cname: ['']
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
            this.onCategoryAdd.next(this.form.getRawValue().cname);
            this.formActive = false;
        }
    }


}
