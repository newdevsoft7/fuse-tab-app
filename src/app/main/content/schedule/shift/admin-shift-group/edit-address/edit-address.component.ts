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
	selector: 'app-group-edit-address',
	templateUrl: './edit-address.component.html',
	styleUrls: ['./edit-address.component.scss']
})
export class GroupEditAddressComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('addressInput') addressInputField;

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
			this.addressInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			address: [this.group.address]
		});
		this.formActive = true;
		this.focusInputField();
	}

	async saveForm() {
		if (this.form.valid) {
			const address = this.form.getRawValue().address;
			if (address !== this.group.address) {
				try {
					const res = await this.scheduleService.updateShiftGroup(this.group.id, { address });
					//this.toastr.success(res.message);
					this.group.address = address;
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
