import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-settings-xtrm-add-wallet',
    templateUrl: './add-wallet.component.html',
    styleUrls: ['./add-wallet.component.scss']
})
export class SettingsXtrmAddWalletComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Output() onWalletAdded = new EventEmitter();
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            wname: ['', Validators.required],
            currency: ['', Validators.required]
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
            this.onWalletAdded.next(this.form.value);
            this.formActive = false;
        }
    }

}
