import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileInfoService } from '../profile-info.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-profile-info-edit-element-name',
    templateUrl: './edit-element-name.component.html',
    styleUrls: ['./edit-element-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditElementNameComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private profileInfoService: ProfileInfoService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            ename: [this.element.ename]
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
            const newElement = _.cloneDeep(this.element);
            newElement.ename = this.form.getRawValue().ename;
            this.profileInfoService.updateElement(newElement)
                .subscribe(res => {
                    const element = res.data;
                    this.element.ename = element.ename;
                });
            this.formActive = false;
        }
    }
}
