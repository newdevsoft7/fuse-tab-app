import {
    Component, Input,
    OnInit, ViewEncapsulation
} from '@angular/core';

import {
    FormBuilder,  FormControl,
    FormGroup, Validators
} from '@angular/forms';

import {
    MatAutocompleteSelectedEvent, MatInput,
    MatDatepickerInputEvent, MatRadioChange,
    MatDialogRef, MatDialog
} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import {
    debounceTime, distinctUntilChanged,
    first, map, startWith, switchMap
} from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../../tab/tab.service';
import { ScheduleService } from '../../schedule.service';
import { Tab } from '../../../../tab/tab';
import { FuseConfirmYesNoDialogComponent } from '../../../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';

export class TimeRange {
    from;
    to;
    constructor(from = null, to = null) {
        this.from = from || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
        this.to = to || { hour: 5, minute: 0, meriden: 'PM', format: 12 };
    }
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

    roleForm: FormGroup;
    formErrors: any;
    
    rolePeriod = new TimeRange();
    sameAsShift = true;

    billRateType = 'phr';
    payRateType = 'phr';

    payCategories = [];

    confirmDialogRef: MatDialogRef<FuseConfirmYesNoDialogComponent>;


    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private tabService: TabService,
        private scheduleService: ScheduleService) {
        this.formErrors = {
            rname: {}
        };
    }

    ngOnInit() {
        this.shifts = this.data.shifts;
        this.url = this.data.url;

        this.roleForm = this.formBuilder.group({
            num_required: [1],
            rname: ['', Validators.required],
            application_deadline: [null],
            notes: [''],
            bill_rate: [0],
            pay_rate: [0],
            pay_category_id: ['none'],
            expense_limit: [0],
            completion_notes: [''],
            requirements: [[]]
        });

        this.sameAsShift = true;
        this.scheduleService.getPayLevelCategory().subscribe(res => {
            this.payCategories = res;
        }, err => {
            this.displayError(err);
        })

        // Form Validation
        this.roleForm.valueChanges.subscribe(() => {
            this.onRoleFormValuesChanged();
        });
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
        return (!this.sameAsShift && !this.roleTimeValidate() || !this.roleForm.valid) ? false : true;
    }

    private roleTimeValidate(): boolean {
        const period = this.rolePeriod;
        if (period.from.hour === '' ||
            period.to.hour === '' ||
            (period.from.meriden === 'PM' && period.to.meriden === 'AM')) { return false; }

        if (period.from.meriden === period.to.meriden) {
            return period.from.hour < period.to.hour ? true :
                (period.from.hour === period.to.hour ? (period.from.minute < period.to.minute ? true : false) : false);
        }
        return true;
    }

    onSave() {
        if (!this.validate) { return false; }

        // Make Role Param
        let role = _.cloneDeep(this.roleForm.value);
        
        role = {
            ...role,
            pay_rate_type: this.payRateType,
            bill_rate_type: this.billRateType
        };
        
        if (role.application_deadline) {
            role = {
                ...role,
                application_deadline: moment(role.application_deadline).format('YYYY-MM-DD HH:mm:ss'),
            }
        } else {
            delete role.application_deadline;
        }

        if (role.pay_category_id === 'none') {
            delete role.pay_category_id;
        }

        if (!this.sameAsShift) {
            const role_start = convertTime(this.rolePeriod.from);
            const role_end = convertTime(this.rolePeriod.to);
            role = {
                ...role,
                role_start,
                role_end
            };
        } 

        this.scheduleService.createShiftsRoles(this.shifts, role)
            .subscribe(res => {
                this.toastr.success(`${res.length} ${res.length > 1 ? 'Roles': 'Role'} created.`);

                // Confirm Dialog to ask whether to add another role or not
                this.confirmDialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
                    disableClose: false
                });

                this.confirmDialogRef.componentInstance.confirmMessage = 'Do you want to add another role?';
                this.confirmDialogRef.componentInstance.confirmTitle = 'Confirm';
                this.confirmDialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.resetForm();
                    } else {
                        this.tabService.closeTab(this.url);
                    }
                });

            }, err => {
                this.displayError(err);
            });
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
            requirements: []
        });
        this.formErrors = {
            rname: {}
        };
        this.rolePeriod = new TimeRange();
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}

function hours12to24(h, meridiem) {
    return h == 12 ? (meridiem.toUpperCase() == 'PM' ? 12 : 0) : (meridiem.toUpperCase() == 'PM' ? h + 12 : h);
}

function convertTime({ hour, minute, format, meriden }) {
    return moment({
        minute,
        hour: hours12to24(hour, meriden)
    }).format('HH:mm');
}