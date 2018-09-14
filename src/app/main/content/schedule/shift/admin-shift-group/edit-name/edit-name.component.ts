import {
	Component, OnInit, Input, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

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
		private scMessasgeService: SCMessageService
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
					this.group.gname = gname;
				} catch (e) {
					this.scMessasgeService.error(e);
				}
			}
			this.formActive = false;
		}
	}

	closeForm() {
		this.formActive = false;
	}

}
