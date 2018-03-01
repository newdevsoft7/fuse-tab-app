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
	selector: 'app-admin-shift-edit-contact',
	templateUrl: './edit-contact.component.html',
	styleUrls: ['./edit-contact.component.scss']
})
export class AdminShiftEditContactComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('contactInput') contactInputField;

	@Input() shift;
	@Output() onContactChanged = new EventEmitter;

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	display() {
		return !this.shift.contact ? 'Empty' : this.shift.contact;
	}

	focusInputField() {
		setTimeout(() => {
			this.contactInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			contact: [this.shift.contact]
		});
		this.formActive = true;
		this.focusInputField();
	}

	saveForm() {
		if (this.form.valid) {
			const contact = this.form.getRawValue().contact;
			if (contact !== this.shift.contact) {
				this.scheduleService.updateShift(this.shift.id, { contact })
					.subscribe(res => {
						this.toastr.success(res.message);
						this.onContactChanged.next(contact);
					});
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
