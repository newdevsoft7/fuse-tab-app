import { Component, OnInit, ViewEncapsulation, Input, IterableDiffers } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatInput, MatDatepickerInputEvent } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { 
    debounceTime, distinctUntilChanged,
    first, map, startWith, switchMap
} from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import { TabService } from '../../../../tab/tab.service';
import { ScheduleService } from '../../schedule.service';
import { TokenStorage } from '../../../../../shared/authentication/token-storage.service';
import { Tab } from '../../../../tab/tab';

const SHOULD_BE_ADDED_OPTION = 'SHOULD_BE_ADDED_OPTION';

export class ShiftDate {
    date;
    from;
    to;
    constructor(date = null, from = null, to = null) {
        this.date = date || '';
        this.from = from || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
        this.to = to || { hour: 5, minute: 0, meriden: 'PM', format: 12 };
    }
}

@Component({
    selector: 'app-schedule-new-shift',
    templateUrl: './new-shift.component.html',
    styleUrls: ['./new-shift.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScheduleNewShiftComponent implements OnInit {

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
    locationControl: FormControl = new FormControl();

    // Client
    filteredClients = [];
    clientControl: FormControl = new FormControl();

    trackingCategories = [];
    trackingOptions = [];

    categoryControls: FormControl[] = [];
    filteredTrackingOptions: any[] = [];
    selectedTrackingOptions: any[] = [];

    generic_title_show = false;
    generic_location_show = false;

    constructor(
        private formBuilder: FormBuilder,        
        private toastr: ToastrService,
        private tabService: TabService,
        private scheduleService: ScheduleService,
        private tokenStorage: TokenStorage,
        differs: IterableDiffers) {
        this.formErrors = {
            title: {}
        };
    }

    ngOnInit() {
        this.shiftForm = this.formBuilder.group({
            title:   ['', Validators.required],
            generic_title: [''],
            location_id: [null],
            location: [''],
            generic_location: [''],
            address: [''],
            contact: [''],
            notes: [''],
            manager_ids: [[this.tokenStorage.getUser().id]],
            client_id: [null],
            work_area_ids: [[]],
            tracking_option_ids: [[]],
            isGroup: [false]
        });

        this.managers = (text: string): Observable<any> => {
            return this.scheduleService.getManagers(text);
        };

        this.workAreas = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };

        this.dates.push(new ShiftDate(this.startDate));

        // Location Autocomplete
        this.locationControl.valueChanges
            .startWith('')
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

        // Client Autocomplete
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
                        } else {
                            this.filteredClients = val.trim().length > 0 ? [{
                                id: SHOULD_BE_ADDED_OPTION,
                                cname: val
                            }] : [];
                        }
                    });
                }
            });

        // Tracking Categories Autocomplete
        this.scheduleService.getTrackingCategories().subscribe(res => {
            this.trackingCategories = res;
            this.selectedTrackingOptions = new Array(res.length);

            this.trackingCategories.forEach((t, i) => {
                this.filteredTrackingOptions.push([]);
                
                const control = new FormControl();
                control.valueChanges.startWith('')
                    .debounceTime(300)
                    .distinctUntilChanged()
                    .subscribe(val => {
                        if (typeof val === 'string') {
                            this.selectedTrackingOptions[i] = null;
                            this.updateTrackingOptions();

                            this.scheduleService.getAutoTrackingOptionsByCategory(t.id, val.trim().toLowerCase()).subscribe(res => {
                                if (res.length > 0) {
                                    this.filteredTrackingOptions[i] = res;
                                } else {
                                    this.filteredTrackingOptions[i] = val.trim().length > 0 ? [{
                                        id: SHOULD_BE_ADDED_OPTION,
                                        oname: val,
                                        tracking_cat_id: t.id
                                    }] : [];
                                }
                            });
                        }
                    });
                this.categoryControls.push(control);
            })
        });

        // Tracking Options
        this.scheduleService.getTrackingOptions().subscribe(res => {
            this.trackingOptions = res;
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

    selectTrackingOption(event: MatAutocompleteSelectedEvent, categoryIndex: number) {
        const id = event.option.value.id;
        const value = event.option.value.oname;
        const tracking_cat_id = event.option.value.tracking_cat_id;

        if (id === SHOULD_BE_ADDED_OPTION) {
            const param = {
                tracking_cat_id, 
                oname: value
            };
            this.scheduleService.createTrackingOption(param).subscribe(res => {
                const data = res.data;
                this.selectedTrackingOptions[categoryIndex] = data.id;
                this.updateTrackingOptions();
                this.scheduleService.getAutoTrackingOptionsByCategory(data.tracking_cat_id, '')
                    .subscribe(res => {
                        this.filteredTrackingOptions[categoryIndex] = res;
                    });
            }, err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
        } else {
            this.selectedTrackingOptions[categoryIndex] = id;
            this.updateTrackingOptions();
        }
    }

    trackingOptionDisplayFn(value: any): string {
        return value && typeof value === 'object' ? value.oname : value;
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

    private updateTrackingOptions() {
        this.shiftForm.patchValue({
            tracking_option_ids: this.selectedTrackingOptions.map(v => v).filter(x => x !== null)
        });
    }


    addNewDate() {
        const newDate = new ShiftDate();
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
        const isGroup = this.shiftForm.getRawValue().isGroup;
        
        if (this.dates.length > 1) { // Multiple Shift
            const shifts = _.map(this.dates, date => {
                let shift = this.makeShift(date);
                if (isGroup) { shift = { ...shift, grouped: 1 }; }
                return shift;
            });
            this.scheduleService.createShifts(shifts).subscribe(responses => {
                this.toastr.success(`${responses.length} shifts created.`);
                // Open Role Edit Tab
                const shifts = responses.map(response => response.data.id);
                this.openRoleTab(shifts);

                this.tabService.closeTab(this.data.url);
            }, err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
        } else { // Single Shift
            const shift = this.makeShift(this.dates[0]);
            this.scheduleService.createShift(shift).subscribe(res => {
                this.toastr.success('Shift created.');
                
                // Open Role Edit Tab
                const shifts = [res.data.id];
                this.openRoleTab(shifts);

                this.tabService.closeTab(this.data.url);
            }, err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
        }
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
        const dates_validation = this.dates.every(date => {
            if (date.date === '' ||
                date.from.hour === '' ||
                date.to.hour === '' ||
                (date.from.meriden === 'PM' && date.to.meriden === 'AM')) { return false; }

            if (date.from.meriden === date.to.meriden) {
                return date.from.hour < date.to.hour ? true :
                    (date.from.hour === date.to.hour ? (date.from.minute < date.to.minute ? true : false) : false); 
            }
            return true;
        });

        if (!dates_validation || !this.shiftForm.valid) { return false; }
        
        return true;
    }

    // Make a shift for request
    private makeShift(date: ShiftDate) {
        const { shift_start, shift_end } = convertShiftDateTime(date);
        let shift = _.cloneDeep(this.shiftForm.value);
        shift = {
            ...shift,
            shift_start,
            shift_end
        }
        removeNull(shift);
        return shift;
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
    }).toDate();

    const shift_end = moment({
        year, month, day,
        hour: hours12to24(shiftDate.to.hour, shiftDate.to.meriden),
        minute: shiftDate.to.minute
    }).toDate();
    
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

