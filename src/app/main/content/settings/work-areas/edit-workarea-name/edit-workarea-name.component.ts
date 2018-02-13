import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-work-areas-edit-name',
    templateUrl: './edit-workarea-name.component.html',
    styleUrls: ['./edit-workarea-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasEditNameComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            aname: [this.element.aname]
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
            newElement.aname = this.form.getRawValue().aname;
            this.settingsService.updateWorkArea(newElement.id, newElement)
                .subscribe(res => {
                    const element = res.data;
                    this.element.aname = element.aname;
                });
            this.formActive = false;
        }
    }

}
