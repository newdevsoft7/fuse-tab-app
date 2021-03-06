import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    Output, EventEmitter,
    ViewChild
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MatDrawer, MatSlideToggleChange, MatSelectChange } from '@angular/material';

import { Subject } from 'rxjs/Subject';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

enum Setting {
    work_areas_enable = 95,
    work_areas_msg = 129,
    work_areas_required = 128,
    work_areas_maximum = 145
}


@Component({
    selector: 'app-settings-work-areas',
    templateUrl: './work-areas.component.html',
    styleUrls: ['./work-areas.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasComponent implements OnInit {

    @ViewChild('drawer') drawer: MatDrawer;

    _settings = [];

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    timezones = [];

    items: any = {}; // All Settings

    // Slide Togglable Items
    checkableItems = [
        Setting.work_areas_enable
    ];

    // Number Items
    numberItems = [
        Setting.work_areas_required,
        Setting.work_areas_maximum
    ];

    componentDestroyed = new Subject();

    categories = []; // Work Area Groups
    workAreas = []; // Work Areas by Group
    selectedCategory;

    workAreaForm: FormGroup;
    categoryForm: FormGroup;

    numberRequired = new FormControl();
    numberMaximum = new FormControl();

    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private scMessageService: SCMessageService
    ) { }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {

            const keys = Object.keys(this.Setting).filter(v => _.isNumber(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    if (this.checkableItems.includes(item.id)) { // Slide Togglable Items
                        this.items = { ...this.items, [item.id]: _.toInteger(item.value) === 0 ? false : true };
                    } else if (this.numberItems.includes(item.id)) { // Number Fields
                        switch (item.id) {
                            case Setting.work_areas_required:
                                this.numberRequired.patchValue(item.value);
                                break;

                            case Setting.work_areas_maximum:
                                this.numberMaximum.patchValue(item.value);
                                break;

                            default:
                                break;
                        }
                    } else { // Text Fields
                        this.items = { ...this.items, [item.id]: item.value };
                    }
                }
            });
        }

    }

    ngOnInit() {
        // Get All Work Area Groups
        this.settingsService.getWorkAreaCategories().subscribe(res => {
            this.categories = res;
            if (res.length > 0) {
                this.selectCategory(this.categories[0]); // Select first work area group
            }
            this.drawer.open();
        });

        this.numberRequired.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                this.onChange(Setting.work_areas_required, value);
            });

        this.numberMaximum.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                this.onChange(Setting.work_areas_maximum, value);
            });

        this.getTimezones();

        this.resetworkAreaForm();
        this.resetCategoryForm();
    }

    resetCategoryForm() {
        this.categoryForm = this.formBuilder.group({
            cname: ['', Validators.required]
        });
    }

    resetworkAreaForm() {
        this.workAreaForm = this.formBuilder.group({
            aname: ['', Validators.required],
            php_tz: [null],
            work_area_cat_id: []
        });
    }

    onChange(id: Setting, event: MatSlideToggleChange | MatSelectChange | string) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        let value;

        if (event instanceof MatSlideToggleChange) { // Slide Toggle
            value = event.checked ? 1 : 0;
        } else if (event instanceof MatSelectChange) { // Select Box
            value = event.value;
        } else { // Input Text
            value = event;
        }
        this.settingsService.setSetting(id, value).subscribe(() => {
            setting.value = value;
            this.settingsChange.next(this.settings);
        });
    }

    // Select Category
    selectCategory(category) {
        this.selectedCategory = category;
        this.getWorkAreas(category.id);
    }

    getWorkAreas(categoryId) {
        this.settingsService.getWorkAreas().subscribe(res => {
            //this.workAreas = _.filter(res, ['work_area_cat_id', categoryId]);
            this.workAreas = _.filter(res, function (item) {
                return item.work_area_cat_id == categoryId;
            });
        });
    }

    addCategory() {
        const cname = this.categoryForm.getRawValue().cname;
        this.settingsService.createWorkAreaCategory(cname).subscribe(res => {
            //this.toastr.success(res.message);
            this.categories.push(res.data);
            this.resetCategoryForm();
        }, err => {
            this.scMessageService.error(err);
        });
    }

    addWorkArea() {
        let params = this.workAreaForm.getRawValue();
        params = { ...params, work_area_cat_id: this.selectedCategory.id };
        if (!params.php_tz) { delete params.php_tz; }
        this.settingsService.createWorkArea(params).subscribe(res => {
            //this.toastr.success(res.message);
            this.workAreas.push(res.data);
            this.resetworkAreaForm();
        }, err => {
            this.scMessageService.error(err);
        });
    }

    onWorkAreaDeleted(workArea) {
        const index = _.findIndex(this.workAreas, ['id', workArea.id]);
        this.workAreas.splice(index, 1);
    }

    onCategoryDeleted(category) {
        const index = _.findIndex(this.categories, ['id', category.id]);
        this.categories.splice(index, 1);
        this.selectedCategory = null;
    }

    private getTimezones() {
        this.settingsService.getTimezones()
            .subscribe(res => {
                this.timezones = [];
                Object.keys(res).forEach(key => {
                    this.timezones.push({ value: key, label: res[key] });
                });

            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

}
