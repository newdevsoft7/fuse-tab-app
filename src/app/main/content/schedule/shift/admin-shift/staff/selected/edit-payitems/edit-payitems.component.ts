import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';

@Component({
    selector: 'app-admin-shift-edit-payitems',
    templateUrl: './edit-payitems.component.html',
    styleUrls: ['./edit-payitems.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftEditPayitemsComponent implements OnInit {

    TYPE: any[] = [
        { value: 'phr', label: '/hr' },
        { value: 'flat', label: 'flat' },
    ];

    formActive = false;
    form: FormGroup;

    @Input() editable;

    @Input() staff;
    @Output() onPayItemsChanged = new EventEmitter;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
    }

    openForm() {
        const payRateType = !this.staff.pay_rate_type ? 'phr' : this.staff.pay_rate_type;
        this.form = this.formBuilder.group({
            payRate: [this.staff.pay_rate, Validators.required],
            payRateType: [payRateType, Validators.required]
        });
        this.formActive = true;
    }

    display() {
        const payRate = !this.staff.pay_rate ? 'Empty' : `$${this.staff.pay_rate}`;
        const payRateType = !this.staff.pay_rate_type ? 'Empty' : this.TYPE.find(t => t.value === this.staff.pay_rate_type).label;
        return `${payRate} ${payRateType}`;  
    }

    saveForm() {
        if (this.form.valid) {
            const payRate = this.form.getRawValue().payRate;
            const payRateType = this.form.getRawValue().payRateType;
            this.onPayItemsChanged.next({ payRate, payRateType });
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

}
