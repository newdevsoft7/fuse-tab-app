import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { SettingsService } from '../../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-settings-work-areas-edit-category',
    templateUrl: './edit-workarea-category.component.html',
    styleUrls: ['./edit-workarea-category.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasEditCategoryComponent implements OnInit {

    loadingIndicator :boolean = true;

    //categories:any[];
    formActive = false;
    form: FormGroup;
    @Input() element;
    @Input() categories;
    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingsService: SettingsService) { }

    ngOnInit() {
        //this.getCategories();
    }


    openForm() {
        this.form = this.formBuilder.group({
            work_area_cat_id: [this.element.work_area_cat_id]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get categoryname() {
        if (!this.categories) return ' ';
        return this.categories.find(t => t.id == this.element.work_area_cat_id).cname;
    }


    onFormSubmit() {
        if (this.form.valid) {
            const newElement = _.cloneDeep(this.element);
            newElement.work_area_cat_id = this.form.getRawValue().work_area_cat_id;
            this.settingsService.updateWorkArea(newElement.id, newElement)
                .subscribe(res => {
                    this.element.work_area_cat_id = newElement.work_area_cat_id; 
                });
            this.formActive = false;
        }
    }
}
