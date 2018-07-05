import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../user.service';
import { ToastrService } from 'ngx-toastr';

export const PROFILE_ELEMENT_COUNTRY_ID = 100;

@Component({
    selector: 'app-users-profile-edit-country',
    templateUrl: './edit-country.component.html',
    styleUrls: ['./edit-country.component.scss']
})
export class UsersProfileEditCountryComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @Input() element;
    @Input() field;
    @Input() options: any[] = [];
    @ViewChildren('select') select: QueryList<any>;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService
    ) { }

    ngOnInit() {
    }

    openForm() {
        const country = this.options.find(v => v.option == this.element[this.field].value);
        this.form = this.formBuilder.group({
            country_id: [country ? country.id : null]
        });
        this.formActive = true;
        setTimeout(() => this.select.first.open());
    }

    closeForm() {
        this.formActive = false;
    }

    display() {
        const value = this.element[this.field].value;
        return value ? value : 'Empty';
    }

    onFormSubmit() {
        this.saveForm();
        this.formActive = false;
    }

    saveForm() {
        if (this.form.valid) {
            const country_id = this.form.getRawValue().country_id;
            if (country_id != this.element[this.field].value) {
                this.element[this.field].value = country_id;
                this.userService.updateProfile(this.element.id, PROFILE_ELEMENT_COUNTRY_ID, country_id)
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
