import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileInfoService } from '../profile-info.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-profile-info-edit-element-sex',
	templateUrl: './edit-element-sex.component.html',
	styleUrls: ['./edit-element-sex.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditElementSexComponent implements OnInit {

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
			sex: [!this.element.sex ? 'Both' : this.element.sex]
		});
		this.formActive = true;
	}

	closeForm() {
		this.formActive = false;
	}


	onFormSubmit() {
		if (this.form.valid) {
			const newElement = _.cloneDeep(this.element);
			const sex = this.form.getRawValue().sex;
			newElement.sex = sex == 'Both' ? null : sex;
			this.profileInfoService.updateElement(newElement)
				.subscribe(res => {
					this.element.sex = newElement.sex;
				});
			this.formActive = false;
		}
	}

}