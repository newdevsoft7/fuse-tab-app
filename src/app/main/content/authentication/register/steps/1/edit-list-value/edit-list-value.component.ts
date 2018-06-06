import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../users/user.service';

@Component({
    selector: 'app-register-profile-edit-list-value',
    templateUrl: './edit-list-value.component.html',
    styleUrls: ['./edit-list-value.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterProfileEditListValueComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;
    @Input() userId;
    @ViewChildren('select') select: QueryList<any>;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            data: [this.element.data]
        });
        this.formActive = true;
        setTimeout(() => this.select.first.open());
    }

    closeForm() {
        this.formActive = false;
    }

    onFormSubmit() {
        this.saveForm();
        this.formActive = false;
    }

    saveForm() {
        if (this.form.valid) {
            const value = this.form.getRawValue().data;
            if (value != this.element.data) {
                this.element.data = value;
                this.userService.updateProfile(this.userId, this.element.id, value)
                    .subscribe(res => {
                        //this.toastr.success(res.message);
                    }, err => {
                        const errors = err.error.errors.data;
                        errors.forEach(v => {
                            this.toastr.error(v);
                        });
                    });
            }
        }
    }
}
