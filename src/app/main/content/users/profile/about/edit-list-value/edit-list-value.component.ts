import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { UserService } from '../../../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-profile-edit-list-value',
    templateUrl: './edit-list-value.component.html',
    styleUrls: ['./edit-list-value.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileEditListValueComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;
    @Input() userId;

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
    }

    closeForm() {
        this.formActive = false;
    }

    onFormSubmit() {
        if (this.form.valid) {
            const value = this.form.getRawValue().data;
            if (value != this.element.data) {
                this.userService.updateProfile(this.userId, this.element.id, value)
                    .subscribe(res => {
                        this.element.data = value;
                        this.toastr.success(res.message);
                    }, err => {
                        const errors = err.error.errors.data;
                        errors.forEach(v => {
                            this.toastr.error(v);
                        });
                    });
            }
            this.formActive = false;
        }
    }
}
