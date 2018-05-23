import {
	Component, OnInit, ViewEncapsulation,
	Input, Output, EventEmitter,
	ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-group-edit-contact',
	templateUrl: './edit-contact.component.html',
	styleUrls: ['./edit-contact.component.scss']
})
export class GroupEditContactComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('contactInput') contactInputField;

	@Input() group;

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	focusInputField() {
		setTimeout(() => {
			this.contactInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			contact: [this.group.contact]
		});
		this.formActive = true;
		this.focusInputField();
	}

	async saveForm() {
		if (this.form.valid) {
			const contact = this.form.getRawValue().contact;
			if (contact !== this.group.contact) {
				try {
					const res = await this.scheduleService.updateShiftGroup(this.group.id, { contact });
					//this.toastr.success(res.message);
					this.group.contact = contact;
				} catch (e) {
					this.displayError(e);
				}
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

	private displayError(e: any) {
		const errors = e.error.errors;
		if (errors) {
			Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
		}
		else {
			this.toastr.error(e.message);
		}
	}

}
