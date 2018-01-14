import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-profile-info-edit-category-name',
	templateUrl: './edit-category-name.component.html',
	styleUrls: ['./edit-category-name.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditCategoryNameComponent implements OnInit {

	formActive = false;
	form: FormGroup;
	@Input() category;
	@ViewChild('nameInput') nameInputField;

	constructor(private formBuilder: FormBuilder) { }

	ngOnInit() {
	}

	openForm() {
		this.form = this.formBuilder.group({
			cname: [this.category.cname]
		});
		this.formActive = true;
		this.focusNameField();
	}

	closeForm() {
		this.formActive = false;
	}

	focusNameField() {
		setTimeout(() => {
			this.nameInputField.nativeElement.focus();
		});
	}

	onFormSubmit() {
		if (this.form.valid) {
			this.category.cname = this.form.getRawValue().cname;
			this.formActive = false;
		}
	}

}
