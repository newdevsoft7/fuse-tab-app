import {
    Component, EventEmitter, Input,
    OnInit, Output, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../users/user.service';

@Component({
    selector: 'app-register-profile-edit-listm-value',
    templateUrl: './edit-listm-value.component.html',
    styleUrls: ['./edit-listm-value.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterProfileEditListmValueComponent implements OnInit {

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
        const values = _.split(this.element.data, ',');
        this.form = this.formBuilder.group({
            data: [values]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    onFormSubmit() {
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
            this.formActive = false;
        }
    }
}
