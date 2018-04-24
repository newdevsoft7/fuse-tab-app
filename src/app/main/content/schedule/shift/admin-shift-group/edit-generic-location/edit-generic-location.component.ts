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
	selector: 'app-group-edit-generic-location',
	templateUrl: './edit-generic-location.component.html',
	styleUrls: ['./edit-generic-location.component.scss']
})
export class GroupEditGenericLocationComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('locationInput') locationInputField;

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
			this.locationInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			generic_location: [this.group.generic_location]
		});
		this.formActive = true;
		this.focusInputField();
	}

	async saveForm() {
		if (this.form.valid) {
			const generic_location = this.form.getRawValue().generic_location;
			if (generic_location !== this.group.generic_location) {
				try {
					const res = await this.scheduleService.updateShiftGroup(this.group.id, { generic_location })
					this.toastr.success(res.message);
					this.group.generic_location = generic_location;
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
