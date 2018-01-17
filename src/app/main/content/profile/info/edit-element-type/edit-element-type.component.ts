import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileInfoService } from '../profile-info.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-profile-info-edit-element-type',
    templateUrl: './edit-element-type.component.html',
    styleUrls: ['./edit-element-type.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditElementTypeComponent implements OnInit {
    TYPE: any[] = [
        { value: 'short', label: 'Short(40 chars)' },
        { value: 'medium', label: 'Medium(200 chars)' },
        { value: 'long', label: 'Long' },
        { value: 'list', label: 'List(single)' },
        { value: 'listm', label: 'List(multiple)' },
        { value: 'date', label: 'Date' },
        { value: 'number', label: 'Number' },
    ];
    formActive = false;
    form: FormGroup;
    @Input() element;

    constructor(
        private formBuilder: FormBuilder,
        private profileInfoService: ProfileInfoService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            etype: [this.element.etype]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get type() {
        return this.TYPE.find(t => t.value == this.element.etype).label;
    }


    onFormSubmit() {
        if (this.form.valid) {
            const newElement = _.cloneDeep(this.element);
            newElement.etype = this.form.getRawValue().etype;
            this.profileInfoService.updateElement(newElement)
                .subscribe(res => {
                    this.element.etype = newElement.etype; 
                });
            this.formActive = false;
        }
    }
}
