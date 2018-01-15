import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileInfoService } from '../profile-info.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-profile-info-edit-element-visibility',
	templateUrl: './edit-element-visibility.component.html',
    styleUrls: ['./edit-element-visibility.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProfileInfoEditElementVisibilityComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@Input() element;

	constructor(
		private formBuilder: FormBuilder,
		private profileInfoService: ProfileInfoService) { }

	ngOnInit() {
	}

	openForm() {
		this.form = this.formBuilder.group({
			visibility: [this.element.visibility]
		});
		this.formActive = true;
	}

	closeForm() {
		this.formActive = false;
	}


	onFormSubmit() {
		if (this.form.valid) {
			const newElement = _.cloneDeep(this.element);
			newElement.visibility = this.form.getRawValue().visibility;
			this.profileInfoService.updateElement(newElement)
				.subscribe(res => {
					this.element.visibility = newElement.visibility;
				});
			this.formActive = false;
		}
	}

}
