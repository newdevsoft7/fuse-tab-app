import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { UserService } from '../../../user.service';
import { ToastrService } from 'ngx-toastr';

export const PROFILE_ELEMENT_DOB = 3;

@Component({
	selector: 'app-users-profile-edit-date',
	templateUrl: './edit-date.component.html',
	styleUrls: ['./edit-date.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UsersProfileEditDateComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@Input() element;
	@Input() field;
	@Input() userId;

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private userService: UserService) { }

	ngOnInit() {
	}

	openForm() {
		const date = moment(this.element[this.field], 'YYYY-MM-DD HH:mm:ss').toDate();
		this.form = this.formBuilder.group({
			data: [date]
		});
		this.formActive = true;
	}

	closeForm() {
		this.formActive = false;
	}


	onFormSubmit() {
		if (this.form.valid) {
			const value = moment(this.form.getRawValue().data).format('YYYY-MM-DD HH:mm:ss');
			if (value != this.element[this.field]) {
				this.userService.updateProfile(this.userId, PROFILE_ELEMENT_DOB, value)
					.subscribe(res => {
						this.element[this.field] = value; 
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