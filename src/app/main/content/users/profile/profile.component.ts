import { Component, OnInit, Input } from '@angular/core';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { UserService } from '../user.service';


@Component({
	selector: 'app-users-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class UsersProfileComponent implements OnInit {

	@Input('data') user;

	currentUser: any;
	userInfo: any;
	ratings = [];

	constructor(
		private tokenStorage: TokenStorage,
		private userService: UserService
	) { }

	ngOnInit() {
		this.getUserInfo();
		this.currentUser = this.tokenStorage.getUser();
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

	onAvatarChanged(avatar) {
		this.userInfo.ppic_a = avatar;
	}

	private getUserInfo() {
		this.userService
			.getUser(this.user.id)
			.subscribe(res => {
				this.userInfo = res;
			});

		this.userService.getUserRatings(this.user.id).subscribe(ratings => {
			this.ratings = ratings;
		});
	}

}
