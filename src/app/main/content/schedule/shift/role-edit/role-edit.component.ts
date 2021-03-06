import {
    Component, Input,
    OnInit, ViewEncapsulation
} from '@angular/core';

import {
    FormBuilder, FormGroup, Validators
} from '@angular/forms';

import {
    MatRadioChange,
    MatDialogRef, MatDialog, MatSelectChange
} from '@angular/material';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';
import * as moment from 'moment';
import { FuseConfirmYesNoDialogComponent } from '@core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';
import { Tab } from '@main/tab/tab';
import { UserService } from '@main/content/users/user.service';
import { TabService } from '@main/tab/tab.service';
import { SCMessageService } from '@shared/services/sc-message.service';
import { FilterService } from '@shared/services/filter.service';
import { TokenStorage } from '@shared/services/token-storage.service';
import { ActionService } from '@shared/services/action.service';
import { FuseConfirmDialogComponent } from '@core/components/confirm-dialog/confirm-dialog.component';
import { ScheduleService } from '@main/content/schedule/schedule.service';
import { from } from 'rxjs/observable/from';

class TimeRange {
    from;
    to;
    constructor(from = null, to = null) {
        this.from = from || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
        this.to = to || { hour: 5, minute: 0, meriden: 'PM', format: 12 };
    }
}

class PayItem {
    id: number;
    item_name: string;
    item_type: string;
    unit_rate: number;
    units: number;
    currency: string;
    bill_unit_rate: number;
    bill_units: number;
    bill_currency: string;

    constructor(currency: string) {
        this.id = 0;
        this.item_name = null;
        this.item_type = null;
        this.unit_rate = null;
        this.units = null;
        this.bill_unit_rate = null;
        this.bill_units = null;
        this.currency = currency;
        this.bill_currency = currency;
    }
}

// Convert Time to TimeRange
function processTime(dateTime) {
    if (!dateTime) { return; }
    const date = moment(dateTime, 'YYYY-MM-DD HH:mm:ss');
    const minute = date.minute();
    const { hour, meriden } = hours24to12(date.hour());
    return { hour, minute, meriden, format: 12 };
}

@Component({
    selector: 'app-shift-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftRoleEditComponent implements OnInit {

    @Input() data;

    shifts: number[];
    url: string;

    role: any;  // EDIT ROLE FROM SHIFT TAB
    shift: any; // CREATE ROLE FROM SHIFT TAB

    roleForm: FormGroup;
    formErrors: any;

    rolePeriod = new TimeRange();
    sameAsShift = true;

    billRateType = 'phr';
    payRateType = 'phr';

    payCategories = [];
    role_pay_items: any[] = [];

    settings: any;
    reports$;
    currencies: any[] = [];

    readonly types: string[] = [
        'bonus',
        'deduction',
        'expense',
        'travel',
        'other'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmYesNoDialogComponent>;
    expenseLimitCurrencySymbol: string;
    
    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private tabService: TabService,
        private scheduleService: ScheduleService,
        private userService: UserService,
        private tokenStroage: TokenStorage,
        private actionService: ActionService,
        private scMessageService: SCMessageService,
        private filterService: FilterService
    ) {
        this.formErrors = {
            rname: {}
        };
        this.settings = this.tokenStroage.getSettings();
    }

    ngOnInit() {

        const payCurrency = localStorage.getItem('pay_currency');
        const billCurrency = localStorage.getItem('bill_currency');

        this.reports$ = (text: string): Observable<any> => {
            return from(this.filterService.getReportFilter('survey', text));
        };

        this.userService.getCurrencies().then(currencies => {
            this.currencies = currencies;
            this.refreshExpenseLimitCurrencySymbol(this.role ? this.role.pay_currency : (payCurrency ? payCurrency : this.settings.currency));
        });

        // FOR ROLE CREATE FROM NEW SHIFT TAB
        this.shifts = this.data.shifts;
        this.url = this.data.url;

        // FOR ROLE EDIT FROM ADMIN SHIFT TAB
        this.role = this.data.role;

        // FOR ROLE CREATING FROM ADMIN SHIFT TAB
        this.shift = this.data.shift;

        if (this.role) { // ROLE EDIT
            this.roleForm = this.formBuilder.group({
                num_required: [this.role.num_required],
                rname: [this.role.rname, Validators.required],
                application_deadline: [this.role.application_deadline ? moment(this.role.application_deadline).toDate() : null],
                notes: [this.role.notes ? this.role.notes : ''],
                bill_rate: [this.role.bill_rate],
                bill_currency: [this.role.bill_currency],
                pay_rate: [this.role.pay_rate],
                pay_currency: [this.role.pay_currency],
                pay_category_id: [this.role.pay_category_id !== null ? +this.role.pay_category_id : 'none'],
                expense_limit: [this.role.expense_limit],
                completion_notes: [this.role.completion_notes ? this.role.completion_notes : ''] ,
                requirements: [[]], // TODO - ROLE REQUIREMENTS,
                uploads_required: [this.role.uploads_required],
                reports: [this.role.reports]
            });

            // SET RATE TYPE
            this.billRateType = this.role.bill_rate_type;
            this.payRateType = this.role.pay_rate_type;

            // SET ROLE REQUIREMENTS
            this.scheduleService.getRoleRequirementsByRole(this.role.id).subscribe(requirements => {
                this.roleForm.patchValue({ requirements });
            });

            this.role_pay_items = this.role.role_pay_items;

            // SET ROLE PERIOD
            this.rolePeriod = new TimeRange(
                processTime(this.role.role_start),
                processTime(this.role.role_end)
            );

            this.sameAsShift = (!this.role.role_start && !this.role.role_end) ? true : false;

        } else { // ROLE CREATE
            this.roleForm = this.formBuilder.group({
                num_required: [1],
                rname: ['', Validators.required],
                application_deadline: [null],
                notes: [''],
                bill_rate: [0],
                bill_currency: [billCurrency ? billCurrency : this.settings.currency],
                pay_rate: [0],
                pay_currency: [payCurrency ? payCurrency : this.settings.currency],
                pay_category_id: ['none'],
                expense_limit: [0],
                completion_notes: [''],
                requirements: [[]],
                uploads_required: [null],
                reports: [[]]
            });
            this.sameAsShift = true;
        }

        this.scheduleService.getPayLevelCategory().subscribe(res => {
            this.payCategories = res;
        }, err => {
            this.scMessageService.error(err);
        });

        // Form Validation
        this.roleForm.valueChanges.subscribe(() => {
            this.onRoleFormValuesChanged();
        });
    }

    onPayCurrencyChange(event: MatSelectChange) {
        const value = event.value;
        this.refreshExpenseLimitCurrencySymbol(value);
    }

    private refreshExpenseLimitCurrencySymbol(value: any) {
        if (value) {
            const idx = this.currencies.findIndex(c => c.currency_code === value);
            this.expenseLimitCurrencySymbol = idx > -1 ? this.currencies[idx].currency_symbol : '';
        }
        else {
            this.expenseLimitCurrencySymbol = '';
        }
    }

    onRoleFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.roleForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    changeSameAsShift(event: MatRadioChange) {
        this.sameAsShift = event.value;
    }

    get validate() {
        return this.roleForm.invalid ? false : true;
    }

    onSave() {
        if (!this.validate) { return false; }

        // Make Role Param
        let role = _.cloneDeep(this.roleForm.value);
        role = {
            ...role,
            requirements: role.requirements.map(v => v.id),
            reports: role.reports.map(v => v.id),
            pay_rate_type: this.payRateType,
            bill_rate_type: this.billRateType
        };

        if (role.application_deadline) {
            role = {
                ...role,
                application_deadline: moment(role.application_deadline).format('YYYY-MM-DD HH:mm:ss'),
            };
        }

        if (this.sameAsShift) {
          role = {
            ...role,
            role_start: null,
            role_end: null
          };
        } else {
            const role_start = convertTime(this.rolePeriod.from);
            const role_end = convertTime(this.rolePeriod.to);
            role = {
                ...role,
                role_start,
                role_end
            };
        }

        // Pay Items
        const pay_items = this.role_pay_items.map(item => {
            return [
                item.id,
                item.item_type,
                item.item_name,
                item.currency,
                item.unit_rate,
                item.units,
                item.bill_currency,
                item.bill_unit_rate,
                item.bill_units
            ].join('|');
        });

        role = { ...role, pay_items };

        if (this.shifts) { // ROLE CREATE
            this.scheduleService.createShiftsRoles(this.shifts, role)
                .subscribe(() => {
                        //this.toastr.success(`${res.length} ${res.length > 1 ? 'Roles' : 'Role'} created.`);
                        this.saveCurrencyToLocalStorage();
                        // Confirm Dialog to ask whether to add another role or not
                        this.confirmDialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
                            disableClose: false
                        });
                        this.confirmDialogRef.componentInstance.confirmMessage = 'Do you want to add another role?';
                        this.confirmDialogRef.componentInstance.confirmTitle = 'Confirm';
                        this.confirmDialogRef.afterClosed().subscribe(result => {
                            if (result) {
                                this.resetForm();
                            }
                            else {
                                this.tabService.closeTab(this.url);
                            }
                        });
                    }, err => {
                    this.scMessageService.error(err);
                });
        } else if (this.shift) { // ROLE CREATE FROM SHIFT TAB
            this.scheduleService.createShiftRole(this.shift.id, role)
                .subscribe(() => {
                        //this.toastr.success(res.message);
                        this.saveCurrencyToLocalStorage();
                        this.tabService.closeTab(this.url);
                        this.openShiftTab(this.shift.id, this.shift.title);
                    }, err => {
                    this.scMessageService.error(err);
                });
        } else { // ROLE UPDATE
            this.scheduleService.updateShiftRole(this.role.id, role)
                .subscribe(() => {
                        //this.toastr.success(res.message);
                        this.tabService.closeTab(this.url);
                        this.openShiftTab(this.role.shift_id, this.role.shift_title);
                    }, err => {
                    this.scMessageService.error(err);
                });
        }
    }

    saveCurrencyToLocalStorage() {
        localStorage.setItem('pay_currency', this.roleForm.value.pay_currency);
        localStorage.setItem('bill_currency', this.roleForm.value.bill_currency);
    }

    onDelete() {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    await this.scheduleService.deleteShiftRole(this.role.id);
                    this.tabService.closeTab(this.tabService.currentTab.url);
                    this.actionService.deleteRole$.next([this.role.id]);
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    private openShiftTab(id, title) {
        const template = 'adminShiftTpl';
        const url = `admin/shift/${id}`;
        const tab = new Tab(title, template, url, { id, url });
        this.tabService.closeTab(url);
        this.tabService.openTab(tab);
    }

    private resetForm() {
        this.billRateType = 'phr';
        this.payRateType = 'phr';
        this.roleForm.patchValue({
            num_required: 1,
            rname: '',
            application_deadline: null,
            notes: '',
            bill_rate: 0,
            pay_rate: 0,
            pay_category_id: 'none',
            expense_limit: 0,
            completion_notes: '',
            requirements: [],
            uploads_required: [],
            reports: []
        });
        this.formErrors = {
            rname: {}
        };
        this.rolePeriod = new TimeRange();
    }

    addPayItem() {
        const item = new PayItem(this.settings.currency);
        this.role_pay_items.unshift(item);
    }

    deletePayItem(index) {
        this.role_pay_items.splice(index, 1);
    }

    onPayItemChanged(value, item, field) {
        if (!item[field]) {
            item[field] = value;
        }
    }

}

function hours12to24(h, meridiem) {
    return h === 12 ? (meridiem.toUpperCase() === 'PM' ? 12 : 0) : (meridiem.toUpperCase() === 'PM' ? h + 12 : h);
}

function hours24to12(h) {
    return {
        hour: (h + 11) % 12 + 1,
        meriden: h >= 12 ? 'PM' : 'AM'
    };
}

function convertTime({ hour, minute, meriden }) {
    return moment({
        minute,
        hour: hours12to24(hour, meriden)
    }).format('HH:mm');
}
