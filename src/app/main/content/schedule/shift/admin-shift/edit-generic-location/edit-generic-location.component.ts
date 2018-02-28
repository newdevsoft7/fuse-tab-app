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
	selector: 'app-admin-shift-edit-generic-location',
	templateUrl: './edit-generic-location.component.html',
	styleUrls: ['./edit-generic-location.component.scss']
})
export class AdminShiftEditGenericLocationComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('locationInput') locationInputField;

	@Input() shift;
	@Output() onGenericLocationChanged = new EventEmitter;

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	display() {
		return !this.shift.generic_location ? 'Empty' : this.shift.generic_location;
	}

	focusInputField() {
		setTimeout(() => {
			this.locationInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			location: [this.shift.generic_location]
		});
		this.formActive = true;
		this.focusInputField();
	}

	saveForm() {
		if (this.form.valid) {
			const genericLocation = this.form.getRawValue().location;
			if (genericLocation !== this.shift.generic_location) {
				this.scheduleService.updateShift(this.shift.id, { generic_location: genericLocation })
					.subscribe(res => {
						this.toastr.success(res.message);
						this.onGenericLocationChanged.next(genericLocation);
					});
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
