import { Component, OnInit, ViewEncapsulation, Input, IterableDiffers } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDatepickerInputEvent } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';
import * as moment from 'moment';

import { TabService } from '../../../../tab/tab.service';
import { ScheduleService } from '../../schedule.service';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { Tab } from '../../../../tab/tab';

const SHOULD_BE_ADDED_OPTION = 'SHOULD_BE_ADDED_OPTION';

class ShiftDate {
    date;
    from;
    to;
    constructor(date = null, from = null, to = null) {
        this.date = date || moment(new Date(), 'YYYY-MM-DD');
        this.from = from || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
        this.to = to || { hour: 5, minute: 0, meriden: 'PM', format: 12 };
    }

    isValid() {
        return true;
        // Jeremy - the following is not needed because some shifts are eg 10pm - 3am next day
        /*
        const date = moment(this.date, 'YYYY-MM-DD');
        const year = date.year();
        const month = date.month();
        const day = date.date();

        const from = moment({
            year, month, day,
            hour: hours12to24(this.from.hour, this.from.meriden),
            minute: this.from.minute
        });

        const to = moment({
            year, month, day,
            hour: hours12to24(this.to.hour, this.to.meriden),
            minute: this.to.minute
        });
        return from.isBefore(to) ? true : false;
        */
    }
}

@Component({
    selector: 'app-new-shift',
    templateUrl: './new-shift.component.html',
    styleUrls: ['./new-shift.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewShiftComponent implements OnInit {

    @Input() data;

    get startDate() {
        if (this.data.date) {
            return this.data.date.toISOString();
        } else {
            return new Date().toISOString();
        }
    }

    dates = [];

    shiftForm: FormGroup;
    formErrors: any;

    managers;
    workAreas;

    // Location
    filteredLocations = [];

    // Client
    filteredClients = [];
    clientControl: FormControl = new FormControl();

    generic_title_show = false;
    generic_location_show = false;

    categories: any[] = []; // Tracking Categories & Options
    settings: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private tabService: TabService,
        private scheduleService: ScheduleService) {
        this.formErrors = {
            title: {}
        };
    }

    async ngOnInit() {
        this.shiftForm = this.formBuilder.group({
            title:   ['', Validators.required],
            generic_title: [''],
            location_id: [null],
            location: [''],
            generic_location: [''],
            address: [''],
            contact: [''],
            notes: [''],
            manager_ids: [[]],
            client_id: [null],
            work_area_ids: [[]],
            tracking_option_ids: [[]],
            isGroup: [false]
        });

        try {
            let res: any;
            if (this.data.shiftId) { // Copy shift from calendar
                res = await this.scheduleService.getShift(this.data.shiftId);
                const tracking_option_ids = _.flattenDeep(res.tracking_categories.map(v => v.options.map(k => k.id)))
                this.shiftForm.patchValue({
                    title:   res.title,
                    generic_title: res.generic_title,
                    location: res.location,
                    generic_location: res.generic_location,
                    address: res.address,
                    contact: res.contact,
                    notes: res.notes,
                    manager_ids: res.managers,
                    client_id: res.client_id,
                    work_area_ids: res.work_areas,
                    tracking_option_ids: tracking_option_ids,
                    isGroup: false
                });
                if (res.date) {
                    const start = convertShiftTime(res.start);
                    const end = convertShiftTime(res.end);
                    const date = moment(res.shift_start, 'YYYY-MM-DD').toISOString();
                    this.dates.push(new ShiftDate(date, start, end));
                }
            } else {
                this.dates.push(new ShiftDate(this.startDate));
                this.init();
            }

            // Get Tracking Categories & Options
            this.scheduleService.getShiftsData().subscribe(response => {
                if (response.tracking) {
                    this.categories = response.tracking;
                    if (this.data.shiftId) {
                        this.categories.forEach(c => {
                            const index = res.tracking_categories.findIndex(v => v.id === c.id);
                            if (index > -1) {
                                c.value = res.tracking_categories[index].options.map(v => v.id);
                            }
                        });
                    } else {
                        this.categories.forEach(c => c.value = []);
                    }
                }

                const clientId = this.shiftForm.getRawValue().client_id;
                if (clientId) {
                    const index = response.clients.findIndex(v => v.id == clientId);
                    if (index > -1) {
                        const clientName = response.clients[index].cname;
                        this.clientControl.patchValue(clientName);
                    }
                }

                // Client Autocomplete
                this.init();

                this.settings = response.settings;
            });
            
        } catch (e) {
            console.log(e);
        }
    }

    init () {
        this.managers = (text: string): Observable<any> => {
            return this.scheduleService.getManagers(text);
        };

        this.workAreas = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };

        // Location Autocomplete
        this.shiftForm.controls['location'].valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(val => {
                if (typeof val === 'string') {
                    this.shiftForm.patchValue({
                        location_id: null,
                        location: val
                    });

                    this.scheduleService.getLocations(val.trim().toLowerCase()).subscribe(res => {
                        this.filteredLocations = res;
                    });
                }
            });
        
        this.clientControl.valueChanges
            .startWith('')
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(val => {
                if (typeof val === 'string') {
                    this.shiftForm.patchValue({
                        client_id: null
                    });
                    this.scheduleService.getClients(val.trim().toLowerCase()).subscribe(res => {
                        if (res.length > 0) {
                            this.filteredClients = res;
                        }
                        else {
                            this.filteredClients = val.trim().length > 0 ? [{
                                id: SHOULD_BE_ADDED_OPTION,
                                cname: val
                            }] : [];
                        }
                    });
                }
            });

        // Form Validation
        this.shiftForm.valueChanges.subscribe(() => {
            this.onShiftFormValuesChanged();
        });
    }

    onShiftFormValuesChanged() {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.shiftForm.get(field);

            if (control && control.dirty && !control.valid) {
                this.formErrors[field] = control.errors;
            }
        }
    }

    locationDisplayFn(value: any): string {
        return value && typeof value === 'object' ? value.lname : value;
    }

    selectLocation(event: MatAutocompleteSelectedEvent): void {
        const location = event.option.value;
        this.shiftForm.patchValue({
            location_id: location.id,
            location: location.lname,
            generic_location: location.generic_lname,
            address: location.address
        });
    }

    selectClient(event: MatAutocompleteSelectedEvent) {
        const id = event.option.value.id;
        const value = event.option.value.cname;

        if (id === SHOULD_BE_ADDED_OPTION) {
            const param = {
                cname: value
            };
            this.scheduleService.createClient(param).subscribe(res => {
                const data = res.data;
                this.shiftForm.patchValue({
                    client_id: data.id
                });
                this.scheduleService.getClients('')
                    .subscribe(res => {
                        this.filteredClients = res;
                    });
            }, err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
        } else {
            this.shiftForm.patchValue({
                client_id: id
            });
        }
    }

    clientDisplayFn(value: any): string {
        return value && typeof value === 'object' ? value.cname : value;
    }

    addNewDate() {
        const newDate = <ShiftDate>_.cloneDeep(this.dates[this.dates.length - 1]);
        newDate.date = moment(this.dates[this.dates.length - 1].date).add(1, 'days').format('YYYY-MM-DD');
        this.dates.push(newDate);
    }

    removeDate(index) {
        this.dates.splice(index, 1);
        if (this.dates.length === 1) {
            this.shiftForm.patchValue( {
                isGroup: false
            });
        }
    }

    changeDate(index, event: MatDatepickerInputEvent<Date>) {
        this.dates[index].date = event.value;
    }

    onSave() {
        if (!this.validate()) {
            return false;
        }

        let params = _.cloneDeep(this.shiftForm.value);
        params = {
            ...params,
            manager_ids: params.manager_ids.map(v => v.id),
            work_area_ids: params.work_area_ids.map(v => v.id)
        };

        const isGroup = this.shiftForm.getRawValue().isGroup;
        params = { ...params, grouped: isGroup ? 1 : 0 };

        const shift_starts = [];
        const shift_ends = [];

        // Add shift start & end array to params
        this.dates.forEach(date => {
            let { shift_start, shift_end } = convertShiftDateTime(date);
            shift_starts.push(shift_start);
            shift_ends.push(shift_end);
        });
        params = { ...params, shift_start: shift_starts, shift_end: shift_ends };

        // Add tracking options
        const tracking_option_ids = _.flattenDeep(this.categories.map(c => c.value))
        params = { ...params, tracking_option_ids };
        removeNull(params);

        if (this.data.shiftId) {
            params = { ...params, shift_id: this.data.shiftId };
        }
        this.scheduleService.createShift(params).subscribe(res => {
            //this.toastr.success(res.message);
            // Open Role Edit Tab
            const shifts = res.data.map(shift => shift.id);
            if (this.data.shiftId) {
                // TODO    
            } else {
                this.openRoleTab(shifts);
            }

            this.tabService.closeTab(this.data.url);
        }, err => {
            const errors = err.error.errors;
            Object.keys(errors).forEach(v => {
                this.toastr.error(errors[v]);
            });
        });

    }

    private openRoleTab(shifts) {
        const url = `shift/${shifts.join('-')}/role-edit`;
        const tab = new Tab(
            `Add Role (${shifts.length} ${shifts.length > 1 ? 'shifts' : 'shift'})`,
            'shiftRoleEditTpl',
            url,
            { shifts, url });
        this.tabService.openTab(tab);
    }

    private validate() {
        const dates_validation = this.dates.every((date: ShiftDate) => date.isValid());
        if (!dates_validation || !this.shiftForm.valid) { return false; }
        return true;
    }

}

// Return FROM and TO datetimes
function convertShiftDateTime(shiftDate: ShiftDate) {
    const date = moment(shiftDate.date);
    const year = date.year();
    const month = date.month();
    const day = date.date();

    const shift_start = moment({
        year, month, day,
        hour: hours12to24(shiftDate.from.hour, shiftDate.from.meriden),
        minute: shiftDate.from.minute
    }).format('YYYY-MM-DD HH:mm:ss');

    const shift_end = moment({
        year, month, day,
        hour: hours12to24(shiftDate.to.hour, shiftDate.to.meriden),
        minute: shiftDate.to.minute
    }).format('YYYY-MM-DD HH:mm:ss');

    return {
        shift_start,
        shift_end
    };
}

function hours12to24(h, meridiem) {
    return h == 12 ? (meridiem.toUpperCase() == 'PM' ? 12 : 0) : (meridiem.toUpperCase() == 'PM' ? h + 12 : h);
}

function removeNull(obj) {
    Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
}

function convertShiftTime(time: string) {
    if (!time) { return; }
    const [hour, temp] = time.split(':');
    const [minute, meriden] = temp.split(' ');
    // hour: 5, minute: 0, meriden: 'PM', format: 12
    return { hour: +hour, minute: +minute, meriden: meriden.toUpperCase(), format: 12 };
}
