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
    @Input() userId;
    @Output() updateSex: EventEmitter<string> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService) { }

    ngOnInit() {
        this.updateSex.next(this.element.data);
    }

    openForm() {
        this.form = this.formBuilder.group({
            sex: [this.element.data]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    onFormSubmit() {
        if (this.form.valid) {
            const sex = this.form.getRawValue().sex;
            if (sex != this.element.data) {
                this.element.data = sex;
                this.updateSex.next(sex);
                this.userService.updateProfile(this.userId, this.element.id, sex)
                    .subscribe(res => {
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
