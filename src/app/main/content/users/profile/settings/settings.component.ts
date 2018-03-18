import {
    Component, OnInit, Input,
    ViewChild
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';

import * as _ from 'lodash';

@Component({
    selector: 'app-users-profile-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class UsersProfileSettingsComponent implements OnInit {


    @Input('userInfo') user;
    @Input() currentUser;

    // Left Side Navs
    categories = [
        {
            'id': 'admin',
            'title': 'Admin',
            'level': ['owner']
        },
        {
            'id': 'client',
            'title': 'Client',
            'level': ['owner', 'admin']
        }
    ];

    selectedCategory;

    constructor() { }

    ngOnInit() {
        this.getCategoryListByUser();
    }

    select(category) {
        this.selectedCategory = category;
    }

    getCategoryListByUser() {
        this.categories = _.filter(this.categories, (c) => c.level.includes(this.currentUser.lvl));
        if (!_.isEmpty(this.categories)) {
            this.select(this.categories[0]);
        }
    }

}
