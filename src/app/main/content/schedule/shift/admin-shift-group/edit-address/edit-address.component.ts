import {
	Component, OnInit, Input, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { ToastrService } from 'ngx-toastr';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

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
		private scMessageService: SCMessageService
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
					//this.toastr.success(res.message);
					this.group.address = address;
				} catch (e) {
					this.scMessageService.error(e);
				}
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
