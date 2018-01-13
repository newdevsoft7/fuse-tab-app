import {
	Component,
	OnInit,
	ViewEncapsulation
} from '@angular/core';

import { ProfileInfoService } from './profile-info.service';
import { ProfileField } from '../profile-field.model';

@Component({
	selector: 'app-profile-info',
	templateUrl: './profile-info.component.html',
	styleUrls: ['./profile-info.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {

	profileFields: any[] = [];

	constructor(private profileInfoService: ProfileInfoService) { }

	ngOnInit() {
		this.profileInfoService.getFields()
			.subscribe(
				res => {
					this.profileFields = res;
				},
				(err) => {
					console.log(err);
				}
			);
	}

	print() {
		console.log(this.profileFields);
	}

	onDrop(evt) {
	}

	click(model, evt) {
		evt.stopPropagation();
	}

}
