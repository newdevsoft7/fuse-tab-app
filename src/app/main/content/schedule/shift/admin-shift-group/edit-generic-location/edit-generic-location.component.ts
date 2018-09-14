import {
	Component, OnInit, Input, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

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
		private scMessageService: SCMessageService
	)  { }

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
					//this.toastr.success(res.message);
					this.group.generic_location = generic_location;
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
