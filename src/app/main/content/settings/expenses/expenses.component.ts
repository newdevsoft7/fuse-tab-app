import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

enum Setting {
    expenses_enable = 27,
    expenses_staff = 28,
    expense_receipt_required = 29
}

@Component({
    selector: 'app-settings-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss']
})
export class SettingsExpensesComponent implements OnInit {

    @Input() settings = [];
    @Input() options = [];

    @Output() settingsChange = new EventEmitter();
    
    readonly Setting = Setting;
    form: FormGroup;
    categories: any[];

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private scMessageService: SCMessageService
    ) { }

    async ngOnInit() {
        this.form = this.formBuilder.group({
            cname: ['', Validators.required],
        });
        
        try {
            this.categories = await this.settingsService.getExpenseCategories();
        } catch(e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
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

    async addCategory() {
        try {
            const res = await this.settingsService.saveExpenseCategory(this.form.getRawValue());
            this.categories.push(res.data);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async deleteCategory(category) {
        try {
            const index = this.categories.findIndex(v => v.id === category.id);
            this.categories.splice(index, 1);
            await this.settingsService.deleteExpenseCategory(category.id);
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
    }

}
