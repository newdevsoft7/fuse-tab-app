import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { UserService } from '../../../user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
	selector: 'app-users-profile-edit-pay-level',
	templateUrl: './edit-pay-level.component.html',
	styleUrls: ['./edit-pay-level.component.scss']
})
export class UsersProfileEditPayLevelComponent implements OnInit {

	@Input() levels: any[];
	@Input() user: any;
	@ViewChildren('select') select: QueryList<any>;
	
	formActive = false;
	form: FormGroup;
	
	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private scMessageService: SCMessageService
	) { }

	ngOnInit() {
	}

	openForm() {
		const setted = this.levels.find(v => v.set);
		this.form = this.formBuilder.group({
			set: [setted ? setted.id : 'unassigned']
		});
        this.formActive = true;
        setTimeout(() => this.select.first.open());
    }

    closeForm() {
        this.formActive = false;
	}
	
	get display() {
		const setted = this.levels.find(v => v.set);
		return setted ? setted.pname : null;
	}

	async onFormSubmit() {
		const level = this.levels.find(v => v.set);
		const set = this.form.getRawValue().set;
		try {
			if (set === 'unassigned') {
				if (level) {
					await this.userService.setUserPayLevel(this.user.id, level.id, 0);
					this.levels.forEach(v => v.set = false);
				}
			} else {
				await this.userService.setUserPayLevel(this.user.id, set);
				this.levels.forEach(v => v.set = v.id == set);
			}
		} catch(e) {
			this.scMessageService.error(e);
		}
		this.formActive = false;
	}

}
