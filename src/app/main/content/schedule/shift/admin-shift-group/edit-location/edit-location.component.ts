import {
	Component, OnInit, Input, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

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
		private scMessageService: SCMessageService
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
					//this.toastr.success(res.message);
					this.group.location = location;
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
