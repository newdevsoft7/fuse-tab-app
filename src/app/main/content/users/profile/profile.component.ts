import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';


@Component({
	selector: 'app-users-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	animations: fuseAnimations
})
export class UsersProfileComponent implements OnInit {
	@Input('data') user;

	constructor() { }

	ngOnInit() {
	}

}
