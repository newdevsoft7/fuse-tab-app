import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';

@Component({
    selector: 'app-admin-shift-edit-billitems',
    templateUrl: './edit-billitems.component.html',
    styleUrls: ['./edit-billitems.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftEditBillitemsComponent implements OnInit {

    TYPE: any[] = [
        { value: 'phr', label: '/hr' },
        { value: 'flat', label: 'flat' },
    ];

    @Input() editable;

    formActive = false;
    form: FormGroup;

    @Input() staff;
    @Output() onBillItemsChanged = new EventEmitter;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
    }

    openForm() {
        const billRateType = !this.staff.bill_rate_type ? 'phr' : this.staff.bill_rate_type;
        this.form = this.formBuilder.group({
            billRate: [this.staff.bill_rate, Validators.required],
            billRateType: [billRateType, Validators.required]
        });
        this.formActive = true;
    }

    display() {
        const billRate = !this.staff.bill_rate ? 'Empty' : `$${this.staff.bill_rate}`;
        const billRateType = !this.staff.bill_rate_type ? 'Empty' : this.TYPE.find(t => t.value === this.staff.bill_rate_type).label;
        return `${billRate} ${billRateType}`;  
    }

    saveForm() {
        if (this.form.valid) {
            const billRate = this.form.getRawValue().billRate;
            const billRateType = this.form.getRawValue().billRateType;
            this.onBillItemsChanged.next({ billRate, billRateType });
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

}
