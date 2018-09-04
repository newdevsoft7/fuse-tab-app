import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

import { PayrollService } from '../payroll.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { TrackingService } from '../../tracking/tracking.service';
import { TabService } from '../../../tab/tab.service';
import { Tab } from '../../../tab/tab';
import { ActionService } from '../../../../shared/services/action.service';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'app-generate-payroll',
    templateUrl: './generate-payroll.component.html',
    styleUrls: ['./generate-payroll.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GeneratePayrollComponent implements OnInit {

    constructor(
        private payrollService: PayrollService,
        private trackingService: TrackingService,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private tabService: TabService,
        private tokenStorage: TokenStorage,
        private actionService: ActionService
    ) { }

    readonly types = [
        { label: 'Invoices', value: 'invoice' },
        { label: 'Timesheets', value: 'timesheet' },
        { label: 'WorkMarket', value: 'wm_assignment' },
        { label: 'Xero Payroll', value: 'xero_payslip' }
    ];

    from;
    to;
    type = 'invoice';
    additional = false; // Visibility of additional options
    completedOnly = true;
    trackingOptionId;
    generateDisabled = false;
    datePickerHidden = false;

    trackingOptions: any[] = [];
    filteredOptions: any[] = [];
    getTrackingOptionName;
    trackingFilter: FormControl = new FormControl();

    payrolls: any[] = [];
    categories = [
        'shifts',
        'expense',
        'travel',
        'bonus',
        'deduction',
        'other'
    ];

    currentUser: any;

    xeroDates: any;

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();
        this.from = moment().subtract(2, 'week').toDate();
        this.to = moment().toDate();

        this.getTrackingOptions();

        this.trackingFilter
            .valueChanges
            .map(value => typeof value === 'string' ? value : value.oname)
            .subscribe(val => {
                this.filteredOptions = [];
                this.trackingOptions.forEach(c => {
                    const category = { ...c };
                    const options = c.options.filter(o => o.oname.toLowerCase().includes(val.toLowerCase()));
                    if (options.length > 0) {
                        category.options = options;
                        this.filteredOptions.push(category);
                    }
                });
            });

        this.type = this.actionService.selectedPayrollType || 'invoice';
        this.onTypeChange();

        if (this.currentUser.lvl === 'staff') {
            this.categories[0] = 'shift';
        }
    }

    async onTypeChange() {
        if (this.type === 'xero_payslip') {
            try {
                this.generateDisabled = true;
                this.datePickerHidden = true;
                this.xeroDates = await this.payrollService.getPayrollDates();
                this.generateDisabled = false;
                if (this.xeroDates.periods.length > 0) {
                    this.from = moment(this.xeroDates.periods[0].from).toDate();
                    this.to = moment(this.xeroDates.periods[0].to).toDate();
                }
            } catch (e) {
                this.displayError(e);
            }
        } else {
            this.generateDisabled = false;
            this.datePickerHidden = false;
        }
        this.actionService.selectedPayrollType = this.type;
    }

    onXeroCalendarChange(event: MatSelectChange) {
        const period = event.value;
        this.from = moment(period.from).toDate();
        this.to = moment(period.to).toDate();
    }

    isSaveButtonShow() {
        if (this.type === 'xero_payslip' || this.type === 'wm_assignment') {
            return false;
        } else {
            return this.payrolls.length > 0 ? true : false;
        }
    }

    async generate(): Promise<any> {
        const from = moment(this.from).format('YYYY-MM-DD');
        const to = moment(this.to).format('YYYY-MM-DD');
        const completedOnly = this.completedOnly ? 1 : 0;
        let trackingOptionId = this.trackingFilter.value;

        // Cancel to generate if the following conditions
        if (!this.to || !this.from || !this.type) { return; }
        if (from > to) { return; }
        if (this.additional && typeof (trackingOptionId) === 'string' && !_.isEmpty(trackingOptionId)) { return; }

        if (trackingOptionId) {
            trackingOptionId = typeof (trackingOptionId) !== 'string' ? trackingOptionId.id : null;
        }

        try {
            const res = await this.payrollService.generatePayroll(this.type, from, to, completedOnly, trackingOptionId).toPromise();
            if (res.payrolls.length > 0) {
                this.payrolls = res.payrolls;
                _.forEach(this.payrolls, (payroll, index) => payroll.id = index);
            } else {
                this.payrolls = res.payrolls;
                this.toastr.error('Nothing outstanding was found between your selected dates.');
            }
        } catch (e) {
            this.toastr.error(e.error.message);
        }
    }

    async generateStaffInvoice(): Promise<any> {
        const from = moment(this.from).format('YYYY-MM-DD');
        const to = moment(this.to).format('YYYY-MM-DD');

        if (!this.to || !this.from || !this.type) { return; }
        if (from > to) {
            this.toastr.error('Start date must be earlier than end date');
            return;
        }

        try {
            const res = await this.payrollService.generateStaffInvoice(from, to);
            if (res.payrolls.length > 0) {
                this.payrolls = res.payrolls;
                _.forEach(this.payrolls, (payroll, index) => payroll.id = index);
            } else {
                this.toastr.error('Nothing outstanding was found between your selected dates.');
            }
        } catch (e) {
            this.toastr.error(e.error.message);
        }
    }

    getTrackingOptions() {
        Promise.all([
            this.trackingService.getTrackingCategories().toPromise(),
            this.trackingService.getTrackingOptions().toPromise()
        ]).then(([categories, options]) => {

            this.getTrackingOptionName = (id) => {
                return options.find(o => o.id === id).oname;
            };

            this.trackingOptions = categories.map(c => {
                const os = options.filter(o => o.tracking_cat_id === c.id);
                c.options = os;
                return c;
            });
            this.filteredOptions = _.cloneDeep(this.trackingOptions);
        });
    }

    removePayroll(payroll) {
        const index = _.findIndex(this.payrolls, ['id', payroll.id]);
        this.payrolls.splice(index, 1);
    }

    viewShift(line) {
        const id = line.shift_id;
        const url = `admin/shift/${id}`;
        const tab = new Tab(line.title, 'adminShiftTpl', url, { id, url });
        this.tabService.openTab(tab);
    }

    removeLine(payroll, category, line) {
        const index = _.findIndex(payroll[category], ['id', line.id]);
        payroll[category].splice(index, 1);
    }

    savePayrolls() {
        const ids = [];
        const formData = new FormData();
        if (this.currentUser.lvl !== 'staff') {
            formData.append('type', this.type);
            formData.append('completed_only', this.completedOnly ? '1' : '0');
            formData.append('per_shift', '1');

            _.forEach(this.payrolls, payroll => {
                _.forEach(this.categories, category => {
                    _.forEach(payroll[category], line => {
                        if (!ids[payroll.user_id]) { ids[payroll.user_id] = []; }
                        ids[payroll.user_id].push(line.id);
                    });
                });
            });

            // Payroll Ids
            ids.forEach((items, index) => {
                if (!items) { return; }
                items.forEach(id => formData.append(`payroll[${index}][]`, id));
            });
        } else {
            _.forEach(this.payrolls, payroll => {
                _.forEach(this.categories, category => {
                    _.forEach(payroll[category], line => {
                        ids.push(line.id);
                    });
                });
            });
            // Payroll Ids
            ids.forEach((id, index) => {
                formData.append(`payroll[]`, id);
            });
        }
        formData.append('from', moment(this.from).format('YYYY-MM-DD'));
        formData.append('to', moment(this.to).format('YYYY-MM-DD'));

        let savePayroll$;

        if (this.currentUser.lvl === 'staff') {
            savePayroll$ = this.payrollService.saveStaffInvoice(formData);
        } else {
            savePayroll$ = this.payrollService.savePayroll(formData);
        }

        savePayroll$.subscribe(res => {
            this.toastr.success(res.message);
            this.payrolls = [];
            this.actionService.payrollsChanged$.next(true);
        });
    }

    processPayroll(payroll) {
        // Todo
    }

    isEmpty(payroll) {
        return _.every(this.categories, category => payroll[category].length === 0);
    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.oname : value;
    }

    private displayError(e) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }
}
