import {
        Component, OnInit, Input, ViewChild,
        ViewEncapsulation, Output, EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-pay-category-item',
    templateUrl: './pay-category-item.component.html',
    styleUrls: ['./pay-category-item.component.scss']
})
export class SettingsPayCategoryItemComponent implements OnInit {

    @ViewChild('nameInput') nameInputField;
    @Input() category;
    @Input() selected = false;

    form: FormGroup;
    formActive = false;

    constructor(
        private formBuilder: FormBuilder,
        private settingsSerivce: SettingsService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    focusNameField() {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    openForm() {
        this.form = this.formBuilder.group({
            cname: [this.category.cname, Validators.required],
        });
        this.formActive = true;
        this.focusNameField();
    }

    saveForm() {
        const cname = this.form.getRawValue().cname;
        this.settingsSerivce.updatePayCategory(this.category.id, cname).subscribe(res => {
            this.category.cname = cname;
            this.toastr.success(res.message);
        }, err => {
            this.displayError(err);
        });
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

    delete(category, event) {
        event.stopPropagation();
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}
