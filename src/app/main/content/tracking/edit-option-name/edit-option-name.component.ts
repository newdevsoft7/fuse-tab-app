import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../tracking.service';

@Component({
    selector: 'app-tracking-edit-option-name',
    templateUrl: './edit-option-name.component.html',
    styleUrls: ['./edit-option-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrackingEditOptionNameComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() option;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private trackingService: TrackingService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            oname: [this.option.oname]
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
            const newOption = _.cloneDeep(this.option);
            newOption.cname = this.form.getRawValue().oname;
            this.trackingService.updateTrackingOption(newOption).subscribe(
                res => {
                    const option = res.data;
                    this.option.cname = option.oname;
                },
                err => {
                    const errors = err.error.errors;
                    Object.keys(errors).forEach(v => {
                        this.toastr.error(errors[v]);
                    });
                });
            this.formActive = false;
        }
    }

}
