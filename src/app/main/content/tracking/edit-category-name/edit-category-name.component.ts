import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../tracking.service';
import { TrackingCategory } from '../tracking.models';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-tracking-edit-category-name',
    templateUrl: './edit-category-name.component.html',
    styleUrls: ['./edit-category-name.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrackingEditCategoryNameComponent implements OnInit, OnDestroy {

    formActive = false;
    form: FormGroup;
    
    categories: TrackingCategory[];

    private onCategoriesChanged: Subscription;

    @Input() category;
    @ViewChild('nameInput') nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private trackingService: TrackingService) { 
        this.onCategoriesChanged = this.trackingService.getCategories().subscribe(
            categeories => {
                this.categories = categeories;
            });
        }

    ngOnInit() {
    }

    ngOnDestroy(){
        this.onCategoriesChanged.unsubscribe();
    }

    openForm() {
        this.form = this.formBuilder.group({
            cname: [this.category.cname]
        });
        this.formActive = true;
        this.focusNameField();
    }

    closeForm() {
        this.formActive = false;
    }

    focusNameField() {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    onFormSubmit() {
        if (this.form.valid) {
            const newCategory = _.cloneDeep(this.category);
            newCategory.cname = this.form.getRawValue().cname;
            this.trackingService.updateTrackingCategory(newCategory).subscribe(
                res => {
                    const category = res.data;
                    this.category.cname = category.cname;
                    this.trackingService.toggleCategories(this.categories);
                },
                err => {
                    const errors = err.error.errors;
                    Object.keys(errors).forEach(v => {
                        this.toastr.error(errors[v]);
                    });
                });
            this.formActive = false;
        }
    }

}
