import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

	constructor(private formBuilder: FormBuilder) { }

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
            const sex = this.form.getRawValue().sex;
			this.element.sex = sex == 'Both' ? null : sex;
			this.formActive = false;
		}
	}

}