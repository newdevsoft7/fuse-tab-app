import {
	Component, EventEmitter, Input,
	OnInit, Output, ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../users/user.service';

export const PROFILE_ELEMENT_DOB = 3;

@Component({
	selector: 'app-register-profile-edit-date',
	templateUrl: './edit-date.component.html',
	styleUrls: ['./edit-date.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RegisterProfileEditDateComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@Input() element;
	@Input() field;
	@Input() userId;

	startDate: string;

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private userService: UserService) { }

	ngOnInit() {
		this.startDate = moment().subtract(20, 'y').format('YYYY-MM-DD');
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
				this.element[this.field] = value;
				this.userService.updateProfile(this.userId, PROFILE_ELEMENT_DOB, value)
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
		this.formActive = false;
	}

}
