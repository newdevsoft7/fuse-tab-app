import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, IterableDiffer, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';
import { TrackingService } from './tracking.service';
import { TrackingCategory } from './tracking.models';
import { TokenStorage } from '../../../shared/services/token-storage.service';
import { CustomLoadingService } from '../../../shared/services/custom-loading.service';
import { TabService } from '../../tab/tab.service';

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, AfterViewInit, OnDestroy {

    categories: TrackingCategory[];
    selectedCategory: TrackingCategory;
    private onSelectedCategoryChanged: Subscription;
    private onCategoriesChanged: Subscription;

    options: any = [];
    selectedOption: any;

    @ViewChild('sidenav') private sidenav: MatSidenav;

    @Input() data: any;
    showClient: boolean;

    values: any = {
        admin: [],
        client: [],
        staff: [],
        files: [],
    };

    source: any = {
        admin: [],
        client: [],
        staff: [],
    };

    constructor(
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private toastrService: ToastrService,
        private customLoadingService: CustomLoadingService,
        private tabService: TabService,
        private trackingService: TrackingService) {

        this.onCategoriesChanged = this.trackingService.getCategories().subscribe(
            categories => {
                this.categories = categories;
                let index = this.categories.findIndex(category => category.id === this.selectedCategory.id);
                if (index === -1) {
                    this.tabService.closeTab(this.tabService.currentTab.url);
                }
            });

        this.onSelectedCategoryChanged = this.trackingService.getSelectedCategory().subscribe(
            category => {
                this.selectedCategory = category;
                this.loadOptions(this.selectedCategory.id);
            });

    }

    ngOnInit() {
        this.trackingService.toggleSelectedCategory(this.data);
        this.getTrackingCategories();
        this.showClient = this.tokenStorage.getSettings().client_enable === '1' ? true : false;
    }

    ngOnDestroy() {
        this.onCategoriesChanged.unsubscribe();
        this.onSelectedCategoryChanged.unsubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.sidenav.open();
        }, 200);
    }

    async loadOptions(categoryId: any): Promise<any> {
        try {
            this.customLoadingService.show();
            this.options = await this.trackingService.getTrackingOptionsByCategory(categoryId).toPromise();
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    changeOption(option): void {
        this.selectedOption = option;
        this.loadOptionAccess();
    }

    async loadOptionAccess(): Promise<any> {
        let promise;
        if (this.showClient) {
            promise = Promise.all([
                this.trackingService.getTrackingOptionAccess(this.selectedOption.id, 'admin').toPromise(),
                this.trackingService.getTrackingOptionAccess(this.selectedOption.id, 'client').toPromise(),
                this.trackingService.getTrackingOptionStaff(this.selectedOption.id).toPromise(),
                this.trackingService.getTrackingOptionFiles(this.selectedOption.id).toPromise()
            ]);
        } else {
            promise = Promise.all([
                this.trackingService.getTrackingOptionAccess(this.selectedOption.id, 'admin').toPromise(),
                this.trackingService.getTrackingOptionStaff(this.selectedOption.id).toPromise(),
                this.trackingService.getTrackingOptionFiles(this.selectedOption.id).toPromise()
            ]);
        }
        try {
            this.customLoadingService.show();
            const res = await promise;
            if (this.showClient) {
                this.values.admin = res[0];
                this.values.client = res[1];
                this.values.staff = res[2];
                this.values.files = res[3];
            } else {
                this.values.admin = res[0];
                this.values.staff = res[1];
                this.values.files = res[2];
            }
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    async changeActive(active: boolean): Promise<any> {
        let option = _.cloneDeep(this.selectedOption);
        option.active = active ? 1 : 0;
        try {
            this.customLoadingService.show();
            await this.trackingService.updateTrackingOption(option).toPromise();
            this.selectedOption.active = option.active;
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    async removeSelectedOption(): Promise<any> {
        try {
            this.customLoadingService.show();
            await this.trackingService.deleteTrackingOption(this.selectedOption.id).toPromise();
            let index = this.options.indexOf(this.selectedOption);
            this.options.splice(index, 1);
            this.selectedOption = null;
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    async filterUser(data: { query: string, lvl: string }): Promise<any> {
        if (!data.query) {
            this.source[data.lvl] = [];
            return;
        }
        try {
            this.source[data.lvl] = await this.trackingService.fetchUsersByLevel(data.lvl, data.query).toPromise();
        } catch (e) {
            this.handleError(e);
        }
    }

    async updateUser(user: any, lvl: string, isAdd: boolean): Promise<any> {
        try {
            if (isAdd) {
                let index = this.values[lvl].findIndex(value => value.id === user.id);
                if (index > -1) {
                    this.toastrService.error('This user is already added.');
                    return;
                }
            }
            this.customLoadingService.show();
            await this.trackingService.updateTrackingOptionAccess(this.selectedOption.id, {
                user_id: user.id,
                add: isAdd ? 1 : 0
            }).toPromise();
            if (isAdd) {
                this.values[lvl].push(user);
            } else {
                const index = this.values[lvl].findIndex(value => value.id === user.id);
                this.values[lvl].splice(index, 1);
            }
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    async updateStaffVisibility(visibility: string) {
        const option = _.cloneDeep(this.selectedOption);
        option.staff_visibility = visibility;
        try {
            this.customLoadingService.show();
            await this.trackingService.updateTrackingOption(option).toPromise();
            this.selectedOption.staff_visibility = visibility;
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    async updateFile(file: any, isAdd: boolean): Promise<any> {
        try {
            this.customLoadingService.show();
            if (isAdd) {
                const upload = file.target.files[0];
                if (upload) {
                    let postData = new FormData();
                    postData.append('file', upload);
                    const res = await this.trackingService.addTrackingOptionFile(this.selectedOption.id, postData).toPromise();
                    this.values['files'].push({ ...res.data });
                }
            } else {
                const index = this.values['files'].findIndex(value => value.id === file.id);
                this.values['files'].splice(index, 1);
                await this.trackingService.deleteTrackingOptionFile(file.id).toPromise();
            }
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    async onOptionAdd(newOption) {
        if (newOption === {}) {
            return;
        }
        newOption.tracking_cat_id = this.selectedCategory.id;

        const option = { ...newOption };
        option.active = option.active ? 1 : 0;

        try {
            this.customLoadingService.show();
            const res = await this.trackingService.createTrackingOption(option).toPromise();
            this.options.push({ ...res.data });
        } catch (e) {
            this.handleError(e);
        } finally {
            this.customLoadingService.hide();
        }
    }

    getTrackingCategories() {
        this.categories = this.tokenStorage.getSettings().tracking;
    }

    onCategoryAdd(newCategory) {
        if (newCategory === {}) {
            return;
        }

        const category = new TrackingCategory(newCategory);
        this.trackingService.createTrackingCategory(category).subscribe(
            res => {
                const savedCategory = { ...res.data };
                this.categories.push(savedCategory);
                this.trackingService.toggleSelectedCategory(savedCategory);
                this.trackingService.toggleCategories(this.categories);
            },
            err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
    }

    handleError(e) {
        this.toastrService.error((e.error && e.error.message) ? e.error.message : 'Something is wrong.');
    }
}
