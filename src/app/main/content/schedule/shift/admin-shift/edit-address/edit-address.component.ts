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
	selector: 'app-admin-shift-edit-address',
	templateUrl: './edit-address.component.html',
	styleUrls: ['./edit-address.component.scss']
})
export class AdminShiftEditAddressComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('addressInput') addressInputField;

	@Output() onAddressChanged = new EventEmitter;

	@Input() shift;

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
	}

	display() {
		return !this.shift.address ? 'Empty' : this.shift.address;
	}

	focusInputField() {
		setTimeout(() => {
			this.addressInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			address: [this.shift.address]
		});
		this.formActive = true;
		this.focusInputField();
	}

	saveForm() {
		if (this.form.valid) {
			const address = this.form.getRawValue().address;
			if (address !== this.shift.address) {
				//	TODO
				this.scheduleService.updateShift(this.shift.id, { address })
					.subscribe(res => {
						this.toastr.success(res.message);
						this.onAddressChanged.next(address);
					});
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
