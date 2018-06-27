import {
    Component, OnInit, Input, ViewChild
} from '@angular/core';
import { UserService } from '../../user.service';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';

@Component({
    selector: 'app-users-profile-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class UsersProfileSettingsComponent implements OnInit {

    @Input('userInfo') user;
    @Input() links: any = [];
    @Input() currentUser;
    @Input() settings: any = {};
    @Input() timezones;

    userOptions: any;
    userPermissions: any;

    workAreas: any = [];
    workAreaSource: any = [];
    trackingOptions: any = [];
    trackingOptionSource: any = [];

    userOutsourceCompanies: any = [];
    userOutsourceCompanySource: any = [];

    isWorkHere: boolean = false;
    linkStatus: string;

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
            'lvls': ['owner', 'admin', 'staff', 'client', 'ext'],
            'vis': ['owner', 'admin', 'staff', 'client', 'ext']
        },
        {
            'id': 'link-other-account',
            'title': 'Link to other StaffConnect accounts',
            'lvls': ['owner', 'admin', 'staff', 'client', 'ext'],
            'vis': ['owner', 'admin', 'staff', 'client', 'ext'],
            'disabled': false
        }
    ];

    selectedCategory;

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private tokenStorage: TokenStorage
    ) { }

    ngOnInit() {
        const link = this.categories.find(v => v.id === 'link-other-account');
        if (link) {
            link.disabled = !(this.currentUser.id == this.user.id && !this.tokenStorage.isExistSecondaryUser());
        }
        this.getUserOptions();
        if (this.user.lvl != 'owner' && ['owner', 'admin'].indexOf(this.currentUser.lvl) > -1) {
            this.getUserPermissions();
        }
        if (this.settings.outsource_enable === '1' && this.user.lvl === 'staff' && ['owner', 'admin'].indexOf(this.currentUser.lvl) > -1) {
            this.categories.push({
                'id': 'staff-outsource',
                'title': 'Outsource',
                'lvls': ['staff'],
                'vis': ['owner', 'admin']
            });
            this.getOutsourceCompanies();
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

    private async getUserPermissions() {
        try {
            this.userPermissions = await this.userService.getUserPermissions(this.user.id).toPromise();
            if (this.user.lvl === 'admin') {
                this.updateSublist({ pname: 'admin_staff_all', set: this.userPermissions['admin_staff_all'].set });
                this.updateSublist({ pname: 'admin_shifts_all', set: this.userPermissions['admin_shifts_all'].set });
            } else if (this.user.lvl === 'client') {
                this.updateSublist({ pname: 'client_shift_all', set: this.userPermissions['client_shift_all'].set });
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    async toggleOption(data) {
        try {
            this.spinner.show();
            const res = await this.userService.updateUserOption(this.user.id, data);
            //this.toastr.success(res.message);
        } catch (e) {
            this.handleError(e);
        } finally {
            this.spinner.hide();
        }
    }

    async togglePermission(data) {
        try {
            this.spinner.show();
            const res = await this.userService.updateUserPermission(this.user.id, data);
            this.updateSublist(data);
            //this.toastr.success(res.message);
        } catch (e) {
            this.handleError(e);
        } finally {
            this.spinner.hide();
        }
    }

    private async updateSublist(data) {
        try {
            if (this.user.lvl === 'admin') {
                if (data.pname === 'admin_staff_all' && !data.set && this.workAreas.length === 0) {
                    this.workAreas = await this.userService.getPermissionWorkAreas(this.user.id);
                }
                if (data.pname === 'admin_shifts_all' && !data.set && this.trackingOptions.length === 0) {
                    this.trackingOptions = await this.userService.getPermissionTrackingOptions(this.user.id);
                }
            } else if (this.user.lvl === 'client') {
                if (data.pname === 'client_shift_all' && !data.set && this.trackingOptions.length === 0) {
                    this.trackingOptions = await this.userService.getPermissionTrackingOptions(this.user.id);
                }
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    async filterSource(event) {
        if (!event.query) return;
        try {
            switch (event.type) {
                case 'workArea':
                    this.workAreaSource = await this.userService.searchWorkAreas(event.query);
                    break;
                case 'trackingOption':
                    this.trackingOptionSource = await this.userService.searchTrackingOptions(0, event.query);
                    break;
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    async addItem(event) {
        try {
            this.spinner.show();
            switch (event.type) {
                case 'workArea':
                    await this.userService.updatePermissionWorkArea(this.user.id, {
                        work_area_id: event.item.id,
                        set: 1
                    });
                    this.workAreas.push(event.item);
                    break;
                case 'trackingOption':
                    await this.userService.updatePermissionTrackingOption(this.user.id, {
                        tracking_option_id: event.item.id,
                        set: 1
                    });
                    this.trackingOptions.push(event.item);
                    break;
            }
        } catch (e) {
            this.handleError(e);
        } finally {
            this.spinner.hide();
        }
    }

    async removeItem(event) {
        try {
            this.spinner.show();
            let index;
            switch (event.type) {
                case 'workArea':
                    await this.userService.updatePermissionWorkArea(this.user.id, {
                        work_area_id: event.item.id,
                        set: 0
                    });
                    index = this.workAreas.findIndex(workArea => workArea.id === event.item.id);
                    this.workAreas.splice(index, 1);
                    break;
                case 'trackingOption':
                    await this.userService.updatePermissionTrackingOption(this.user.id, {
                        tracking_option_id: event.item.id,
                        set: 0
                    });
                    index = this.trackingOptions.findIndex(trackingOption => trackingOption.id === event.item.id);
                    this.trackingOptions.splice(index, 1);
                    break;
            }
        } catch (e) {
            this.handleError(e);
        } finally {
            this.spinner.hide();
        }
    }

    async getOutsourceCompanies(): Promise<any> {
        try {
            const res = await this.userService.getOutsourceCompaniesForUser(this.user.id);
            this.userOutsourceCompanies = res.data;
            this.isWorkHere = (res.works_here === 1);
        } catch (e) {
            this.handleError(e);
        }
    }

    async filterOutsourceCompany(query: string): Promise<any> {
        if (!query) {
            this.userOutsourceCompanySource = [];
            return;
        }
        try {
            this.userOutsourceCompanySource = await this.userService.fetchOutsourceCompanies(query);
        } catch (e) {
            this.handleError(e);
        }
    }

    async addOutsourceCompany(company: any): Promise<any> {
        try {
            await this.userService.updateOutsourceCompanyForUser(this.user.id, company.id, true);
        } catch (e) {
            this.handleError(e);
        }
    }

    async removeOutsourceCompany(company: any): Promise<any> {
        try {
            await this.userService.updateOutsourceCompanyForUser(this.user.id, company.id, false);
        } catch (e) {
            this.handleError(e);
        }
    }

    async toggleWorkHere(isWorkHere: boolean): Promise<any> {
        try {
            await this.userService.updateUser(this.user.id, { works_here: isWorkHere ? 1 : 0 });
        } catch (e) {
            this.handleError(e);
        }
    }

    async toggleLinked(linked: boolean): Promise<any> {
        try {
            this.user.linked = linked ? 0 : null;
            const res = await this.userService.updateLink(this.user.id, linked);
            this.linkStatus = res.message;
        } catch (e) {
            this.handleError(e);
        }
    }

    async approveCompany(companyId: number): Promise<any> {
        try {
            const selected = this.links.find(link => link.id === companyId);
            selected.approved = true;
            await this.userService.approveCompany(companyId);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        } else if (e.error.error) {
            this.toastr.error(e.error.error);
        } else {
            this.toastr.error(e.message);
        }
    }

    get isOwnUser(): boolean {
        return !this.tokenStorage.isExistSecondaryUser();
    }
}
