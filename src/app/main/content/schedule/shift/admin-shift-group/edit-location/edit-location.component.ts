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
	selector: 'app-group-edit-location',
	templateUrl: './edit-location.component.html',
	styleUrls: ['./edit-location.component.scss']
})
export class GroupEditLocationComponent implements OnInit {

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
			location: [this.group.location]
		});
		this.formActive = true;
		this.focusInputField();
	}

	async saveForm() {
		if (this.form.valid) {
			const location = this.form.getRawValue().location;
			if (location !== this.group.location) {
				try {
					const res = await this.scheduleService.updateShiftGroup(this.group.id, { location })
					//this.toastr.success(res.message);
					this.group.location = location;
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
