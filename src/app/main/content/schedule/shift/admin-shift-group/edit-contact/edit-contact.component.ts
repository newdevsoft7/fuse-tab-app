import {
	Component, OnInit, Input, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
	selector: 'app-group-edit-contact',
	templateUrl: './edit-contact.component.html',
	styleUrls: ['./edit-contact.component.scss']
})
export class GroupEditContactComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@ViewChild('contactInput') contactInputField;

	@Input() group;

	constructor(
		private formBuilder: FormBuilder,
		private scMessageService: SCMessageService
	) { }

	ngOnInit() {
	}

	focusInputField() {
		setTimeout(() => {
			this.contactInputField.nativeElement.focus();
		});
	}

	openForm() {
		this.form = this.formBuilder.group({
			contact: [this.group.contact]
		});
		this.formActive = true;
		this.focusInputField();
	}

	async saveForm() {
		if (this.form.valid) {
			const contact = this.form.getRawValue().contact;
			if (contact !== this.group.contact) {
				try {
					//this.toastr.success(res.message);
					this.group.contact = contact;
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
