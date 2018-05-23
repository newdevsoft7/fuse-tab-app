import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange, MatSelectChange, MatDialogRef, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';
import { TrackingService } from '../../tracking/tracking.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { TokenStorage } from '../../../../shared/services/token-storage.service';

enum Setting {
    tracking_enable = 94
}


@Component({
    selector: 'app-settings-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class SettingsTrackingComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    @Output() settingsChange = new EventEmitter();
    
    readonly Setting = Setting;

    categories: any = [];
    dialogRef: MatDialogRef<CategoryDialogComponent>;

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private trackingService: TrackingService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.categories = this.tokenStorage.getSettings().tracking;
    }

    value(id: Setting) {
        if (_.isEmpty(this.settings)) return;
        const value = _.find(this.settings, ['id', id]);
        return _.toInteger(value.value) === 0 ? false : true;
    }

    onChange(id: Setting, event: MatSlideToggleChange) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        const value = event.checked ? 1 : 0;
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            //this.toastr.success(res.message);
        });
    }

    addCategory() {
        this.dialogRef = this.dialog.open(CategoryDialogComponent, {
            panelClass: 'tracking-category-dialog'
        });
        this.dialogRef.afterClosed().subscribe(async (res: any) => {
            if (!res) return;
            res.required = res.required? 1 : 0;
            try {
                const response = await this.trackingService.createTrackingCategory(res).toPromise();
                this.categories.push({
                    id: response.data.id,
                    cname: response.data.cname
                });
                this.tokenStorage.setSettings({ ...this.tokenStorage.getSettings(), ...{ tracking: this.categories } });
                this.trackingService.toggleCategories(this.categories);
                //this.toastr.success(response.message);
            } catch (e) {
                this.handleError(e);
            }
        });
    }

    async editCategory(categoryId: any) {
        try {
            const category = await this.trackingService.getTrackingCategory(categoryId).toPromise();
            this.dialogRef = this.dialog.open(CategoryDialogComponent, {
                panelClass: 'tracking-category-dialog',
                data: category
            });
            this.dialogRef.afterClosed().subscribe(async res => {
                if (!res) return;
                res.required = res.required? 1 : 0;
                try {
                    const response = await this.trackingService.updateTrackingCategory(res).toPromise();
                    let category = this.categories.find(category => category.id === response.data.id);
                    category.cname = response.data.cname;
                    this.tokenStorage.setSettings({ ...this.tokenStorage.getSettings(), ...{ tracking: this.categories } });
                    this.trackingService.toggleCategories(this.categories);
                    //this.toastr.success(response.message);
                } catch (e) {
                    this.handleError(e);
                }
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    async deleteCategory(categoryId: number) {
        try {
            const response = await this.trackingService.deleteTrackingCategory(categoryId).toPromise();
            const index = this.categories.findIndex(category => category.id === categoryId);
            this.categories.splice(index, 1);
            this.tokenStorage.setSettings({ ...this.tokenStorage.getSettings(), ...{ tracking: this.categories } });
            this.trackingService.toggleCategories(this.categories);
            //this.toastr.success(response.message);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e: any) {
        this.toastr.error((e.error && e.error.message)? e.error.message : 'Something is wrong.');
    }
}
