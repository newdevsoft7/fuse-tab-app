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
	selector: 'app-admin-shift-edit-title',
	templateUrl: './edit-title.component.html',
	styleUrls: ['./edit-title.component.scss']
})
export class AdminShiftEditTitleComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('titleInput') titleInputField;

	@Input() shift;
	@Output() onTitleChanged = new EventEmitter;

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	display() {
		return !this.shift.title ? 'Empty' : this.shift.title;
	}

	focusInputField() {
		setTimeout(() => {
			this.titleInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			title: [this.shift.title, Validators.required]
		});
		this.formActive = true;
		this.focusInputField();
	}

	saveForm() {
		if (this.form.valid) {
			const title = this.form.getRawValue().title;
			if (title !== this.shift.title) {
				this.scheduleService.updateShift(this.shift.id, { title })
					.subscribe(res => {
						this.toastr.success(res.message);
						this.onTitleChanged.next(title);
					});
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
