import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

	settings: any = {};
	isFavStatusShow = false;

	constructor(
		private tokenStorage: TokenStorage,
		private userService: UserService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.getUserInfo();
		this.currentUser = this.tokenStorage.getUser();
		this.settings = this.tokenStorage.getSettings();
	}

	async toggleFav() {
		const fav = this.userInfo.fav === 1 ? 0 : 1;
		try {
			const res = await this.userService.updateUser(this.userInfo.id, { fav });
			this.toastr.success(res.message);
			this.userInfo.fav = fav;
		} catch (e) {
			this.toastr.error(e.error.error);
		}
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
				this.isFavStatusShow =
					['admin', 'owner'].some(v => this.currentUser.lvl.indexOf(v) > -1)
					&& ['admin', 'staff', 'registrant'].some(v => this.userInfo.lvl.indexOf(v) > -1);
			});

		this.userService.getUserRatings(this.user.id).subscribe(ratings => {
			this.ratings = ratings;
		});
	}

	private displayError(e: any) {
		const errors = e.error.errors;
		if (errors) {
			Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
		}
		else {
			this.toastr.error(e.error.message);
		}
	}

}
