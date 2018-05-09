import {
    Component, OnInit, Input, ViewChild
} from '@angular/core';
import { UserService } from '../../user.service';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

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

    userOptions: any;
    userPermissions: any;

    // Left Side Navs
    categories = [
        {
            'id': 'admin-options',
            'title': 'Options',
            'lvls': ['owner', 'admin'],
            'vis': ['owner', 'admin']
        },
        {
            'id': 'staff-options',
            'title': 'Options',
            'lvls': ['staff'],
            'vis': ['owner', 'admin', 'staff']
        },
        {
            'id': 'client-options',
            'title': 'Options',
            'lvls': ['client'],
            'vis': ['owner', 'admin', 'client']
        },
        {
            'id': 'admin-permissions',
            'title': 'Permissions',
            'lvls': ['admin'],
            'vis': ['owner']
        },
        {
            'id': 'staff-permissions',
            'title': 'Permissions',
            'lvls': ['staff'],
            'vis': ['owner', 'admin']
        },
        {
            'id': 'client-permissions',
            'title': 'Permissions',
            'lvls': ['client'],
            'vis': ['owner', 'admin']
        },
        {
            'id': 'change-password',
            'title': 'Change Password',
            'lvls': ['owner','admin','staff','client','ext'],
            'vis': ['owner','admin','staff','client','ext']
        }
    ];

    selectedCategory;

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.getUserOptions();
        if (this.user.lvl != 'owner') {
            this.getUserPermissions();
        }
        this.getCategoryListByUser();
    }

    select(category) {
        this.selectedCategory = category;
    }

    getCategoryListByUser() {
        this.categories = _.filter(this.categories, (c) => c.lvls.includes(this.user.lvl) && c.vis.includes(this.currentUser.lvl));
        if (!_.isEmpty(this.categories)) {
            this.select(this.categories[0]);
        }
    }

    private getUserOptions() {
        this.userService
            .getUserOptions(this.user.id)
            .subscribe(res => {
                this.userOptions = res;
            });
    }

    private getUserPermissions() {
        this.userService
            .getUserPermissions(this.user.id)
            .subscribe(res => {
                this.userPermissions = res;
            });
    }

    async toggleOption(data) {
        try {
            const res = await this.userService.updateUserOption(this.user.id, data);
            this.toastr.success(res.message);
        } catch (e) {
            this.toastr.error(e.error.message);
        }
    }

    async togglePermission(data) {
        try {
            const res = await this.userService.updateUserPermission(this.user.id, data);
            this.toastr.success(res.message);
        } catch (e) {
            this.toastr.error(e.error.message);
        }
    }
}
