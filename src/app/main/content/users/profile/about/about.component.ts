import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
    selector: 'app-users-profile-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class UsersProfileAboutComponent implements OnInit {

    @Input() userInfo;
    @Input() currentUser;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
    }
}
