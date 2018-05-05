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
    @Input() settings: any = {};

    // Left Side Navs
    categories = [
        {
            'id': 'options',
            'title': 'Options',
            'lvls': ['owner','admin','staff','client','ext']
        },
        {
            'id': 'permissions',
            'title': 'Permissions',
            'lvls': ['admin','staff','client','ext']
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
        this.categories = _.filter(this.categories, (c) => c.lvls.includes(this.user.lvl));
        if (!_.isEmpty(this.categories)) {
            this.select(this.categories[0]);
        }
    }

}
