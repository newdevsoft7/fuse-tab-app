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
	selector: 'app-group-edit-name',
	templateUrl: './edit-name.component.html',
	styleUrls: ['./edit-name.component.scss']
})
export class GroupEditNameComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('nameInput') nameInputField;

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
			this.nameInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			gname: [this.group.gname, Validators.required]
		});
		this.formActive = true;
		this.focusInputField();
	}

	async saveForm() {
		if (this.form.valid) {
			const gname = this.form.getRawValue().gname;
			if (gname !== this.group.gname) {
				try {
					const res = await this.scheduleService.updateShiftGroup(this.group.id, { gname });
					this.toastr.success(res.message);
					this.group.gname = gname;
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
