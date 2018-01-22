import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { UserService } from '../user.service';


@Component({
	selector: 'app-users-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	animations: fuseAnimations
})
export class UsersProfileComponent implements OnInit {
	@Input('data') user;
	userInfo: any;

	constructor(
		private userService: UserService
	) { }

	ngOnInit() {
		this.getUserInfo();
	}

	getAvatar(userInfo) {
		if (userInfo.ppic_a) {
			return userInfo.ppic_a;
		} else {
			switch (userInfo.sex) {
				case 'male':
					return `/assets/images/avatars/nopic_male.jpg`;
				case 'female':
					return `/assets/images/avatars/nopic_female.jpg`;
			}
		}
	}

	private getUserInfo() {
		this.user = this.userService
			.getUser(this.user.id)
			.subscribe(res => {
				this.userInfo = res;
			});
	}

}
