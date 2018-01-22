import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-users-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    @Input('data') user;
    constructor() { }

    ngOnInit() {
    }

}
