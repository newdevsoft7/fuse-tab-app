import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../user.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

export const PROFILE_ELEMENT_SEX = 4;

@Component({
    selector: 'app-users-profile-edit-sex',
    templateUrl: './edit-sex.component.html',
    styleUrls: ['./edit-sex.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersProfileEditSexComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            sex: [this.element.sex]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    onFormSubmit() {
        if (this.form.valid) {
            const sex = this.form.getRawValue().sex;
            if (sex != this.element.sex) {
                this.userService.updateProfile(this.element.id, PROFILE_ELEMENT_SEX, sex)
                    .subscribe(res => {
                        this.element.sex = sex;
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
