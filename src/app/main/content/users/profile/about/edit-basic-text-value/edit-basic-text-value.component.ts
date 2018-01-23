import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { UserService } from '../../../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-users-profile-edit-basic-text-value',
	templateUrl: './edit-basic-text-value.component.html',
	styleUrls: ['./edit-basic-text-value.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UsersProfileEditBasicTextValueComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@Input() element;
	@Input() field: string;
	@ViewChild('dataInput') dataInputField;


	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private userService: UserService) { }

	ngOnInit() {
	}

	openForm() {
		this.form = this.formBuilder.group({
			data: [this.element[this.field]]
		});
		this.formActive = true;
		this.focusNameField();
	}

	focusNameField() {
		setTimeout(() => {
			this.dataInputField.nativeElement.focus();
		});
	}

	closeForm() {
		this.formActive = false;
	}


	onFormSubmit() {
		if (this.form.valid) {
			const value = this.form.getRawValue().data;

			if (value != this.element[this.field]) {
				let field;
				switch (this.field) {
					case 'mob':
						field = 7;	// TODO
						break;
					default:
						field = this.field;
						break;
				}
				this.userService.updateProfile(this.element.id, field, value)
					.subscribe(res => {
						this.element[this.field] = value;
						this.toastr.success(res.message)
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