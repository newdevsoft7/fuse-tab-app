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
	selector: 'app-admin-shift-edit-generic-title',
	templateUrl: './edit-generic-title.component.html',
	styleUrls: ['./edit-generic-title.component.scss']
})
export class AdminShiftEditGenericTitleComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('titleInput') titleInputField;

	@Input() shift;
	@Output() onGenericTitleChanged = new EventEmitter;

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	display() {
		return !this.shift.generic_title ? 'Empty' : this.shift.generic_title;
	}

	focusInputField() {
		setTimeout(() => {
			this.titleInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			title: [this.shift.generic_title]
		});
		this.formActive = true;
		this.focusInputField();
	}

	saveForm() {
		if (this.form.valid) {
			const genericTitle = this.form.getRawValue().title;
			if (genericTitle !== this.shift.generic_title) {
				this.scheduleService.updateShift(this.shift.id, { generic_title: genericTitle })
					.subscribe(res => {
						this.toastr.success(res.message);
						this.onGenericTitleChanged.next(genericTitle);
					});
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
