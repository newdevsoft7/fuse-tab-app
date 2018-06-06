import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { UserService } from '../../../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-profile-edit-listm-value',
    templateUrl: './edit-listm-value.component.html',
    styleUrls: ['./edit-listm-value.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileEditListmValueComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;
    @Input() userId;
    @ViewChildren('select') select: QueryList<any>

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService) { }

    ngOnInit() {
    }

    openForm() {
        const values = _.split(this.element.data, ',');
        this.form = this.formBuilder.group({
            data: [values]
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
            const value = _.join(this.form.getRawValue().data, ',');
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
