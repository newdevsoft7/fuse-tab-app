import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MatDrawer, MatSlideToggleChange, MatSelectChange } from '@angular/material';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    paylvl_enable = 35
}


@Component({
    selector: 'app-settings-pay-levels',
    templateUrl: './pay-levels.component.html',
    styleUrls: ['./pay-levels.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsPayLevelsComponent implements OnInit {

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

    readonly TYPE = [
        { label: '/hr', value: 'phr' },
        { label: 'flat', value: 'flat' }
    ];

    items: any = {}; // All Settings

    // Slide Togglable Items
    checkableItems = [
        Setting.paylvl_enable
    ];

    // Number Items
    numberItems = [
    ];

    componentDestroyed = new Subject();

    categories = []; // Pay Categories
    levels = []; // Pay Levels by Category
    selectedCategory;

    levelForm: FormGroup;
    categoryForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {
            
            const keys = Object.keys(this.Setting).filter(v => _.isNumber(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    if (this.checkableItems.includes(item.id)) { // Slide Togglable Items
                        this.items = { ...this.items, [item.id]: _.toInteger(item.value) === 0 ? false : true };
                    } else if (this.numberItems.includes(item.id)) { // Number Fields

                    } else { // Text Fields
                        this.items = { ...this.items, [item.id]: item.value };
                    }
                }
            });
        }

    }

    ngOnInit() {
        // Get all pay categories
        this.settingsService.getPayCategories().subscribe(res => {
            this.categories = res;
            if (res.length > 0) {
                this.selectCategory(this.categories[0]); // Select first pay category
            }
            this.drawer.open();
        });

        this.resetLevelForm();
        this.resetCategoryForm();
    }

    resetCategoryForm() {
        this.categoryForm = this.formBuilder.group({
            cname: ['', Validators.required]
        });
    }

    resetLevelForm() {
        this.levelForm = this.formBuilder.group({
            pname: ['', Validators.required],
            pay_rate: [0, Validators.required],
            pay_rate_type: ['phr', Validators.required],
            pay_cat_id: []
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
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            //this.toastr.success(res.message);
        });
    }

    // Select Category
    selectCategory(category) {
        this.selectedCategory = category;
        this.getLevels(category.id);
    }

    getLevels(categoryId) {
        this.settingsService.getPayLevelsByCategory(categoryId).subscribe(res => {
            this.levels = res;
        });
    }

    addCategory() {
        const cname = this.categoryForm.getRawValue().cname;
        this.settingsService.createPayCategory(cname).subscribe(res => {
            //this.toastr.success(res.message);
            this.categories.push(res.data);
            this.resetCategoryForm();
        }, err => {
            this.displayError(err);
        });
    }

    addPayLevel() {
        let params = this.levelForm.getRawValue();
        params = { ...params, pay_cat_id: this.selectedCategory.id };
        this.settingsService.createPayLevel(params).subscribe(res => {
            //this.toastr.success(res.message);
            this.levels.push(res.data);
            this.resetLevelForm();
        }, err => {
            this.displayError(err);
        });
    }

    onLevelDeleted(level) {
        const index = _.findIndex(this.levels, ['id', level.id]);
        this.levels.splice(index, 1);
    }

    onCategoryDeleted(category) {
        const index = _.findIndex(this.categories, ['id', category.id]);
        this.categories.splice(index, 1);
        this.selectedCategory = null;
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}
