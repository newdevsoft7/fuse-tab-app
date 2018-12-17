import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
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
    @ViewChildren('select') select: QueryList<any>;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            data: [
              this.element.ename.toLowerCase() !== 'country' ? this.element.data : this.getCountry()
            ]
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
                this.element.data = this.element.ename.toLowerCase() !== 'country' ? value : this.getCountryId(value);
                this.userService.updateProfile(this.userId, this.element.id, value)
                    .subscribe(res => {
                    }, err => {
                        const errors = err.error.errors.data;
                        errors.forEach(v => {
                            this.toastr.error(v);
                        });
                    });
            }
        }
    }

    getDisplayValue() {
      if (this.element.data) {
        if (this.element.ename.toLowerCase() === 'country') {
          const value = this.getCountry();
          return value ? value : 'Empty';
        } else {
          return this.element.data;
        }
      } else {
        return 'Empty';
      }
    }

    getCountry() {
      const index = this.element.options.findIndex(o => o.id == this.element.data);
      return index > -1 ? this.element.options[index].option : null;
    }

    getCountryId(countryName) {
      const index = this.element.options.findIndex(o => o.option === countryName);
      return index > -1 ? this.element.options[index].id : null;
    }
}
