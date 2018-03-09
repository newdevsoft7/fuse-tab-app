import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
	selector: 'app-users-exports',
	templateUrl: './exports.component.html',
	styleUrls: ['./exports.component.scss']
})
export class UsersExportsComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder
	) {
	}

	ngOnInit() {}
}

