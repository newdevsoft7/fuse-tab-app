import {
    Component, OnInit, Input, ViewEncapsulation
} from '@angular/core';

import { ScheduleService } from '../../../schedule.service';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

class ShiftTime {
    time;

    constructor(hour, minute, meriden) {
        this.time = { hour, minute, meriden, format: 12 };
    }

    toString() {
        const time = moment()
            .startOf('day')
            .hours(hours12to24(this.time.hour, this.time.meriden))
            .minute(this.time.minute);

        return time.format('YYYY-MM-DD HH:mm:ss');
    }

}

function hours12to24(h, meriden) {
    return h === 12 ? meriden.toUpperCase() === 'PM' ? 12 : 0 : meriden.toUpperCase() === 'PM' ? h + 12 : h;
}

@Component({
    selector: 'app-edit-shift-detail',
    templateUrl: './edit-shift-detail.component.html',
    styleUrls: ['./edit-shift-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditShiftDetailComponent implements OnInit {

    @Input() shifts;

    list = {
        title:              { checked: false, value: '' },
        generic_title:      { checked: false, value: '' },
        work_area_ids:      { checked: false, value: [] },
        shift_date:         { checked: false, value: '' },
        shift_start_time:   { checked: false, value: new ShiftTime(8, 0, 'AM') },
        shift_end_time:     { checked: false, value: new ShiftTime(5, 0, 'PM') },
        location:           { checked: false, value: '' },
        generic_location:   { checked: false, value: '' },
        address:            { checked: false, value: '' },
        contact:            { checked: false, value: '' },
        manager_ids:        { checked: false, value: [] },
        notes:              { checked: false, value: ''},
        live:               { checked: false, value: false },
        locked:             { checked: false, value: false },
        timezone:           { checked: false, value: '' }
    };

    data; // Shifts data for multiple edit

    flags = [];
    categories = [];
    timezones = [];

    workAreas$;
    managers$;

    notes;


    constructor(
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {

        this.managers$ = (text: string): Observable<any> => {
            return this.scheduleService.getManagers(text);
        };

        this.workAreas$ = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };

        this.scheduleService.getShiftsData().subscribe(res => {
            this.data = res;
            if (this.data.flags) {
                this.flags = this.data.flags;
                this.flags.forEach(f => {
                    f.value = false;
                    f.checked = false;
                });
            }

            if (this.data.tracking) {
                this.categories = this.data.tracking;
                this.categories.forEach(c => {
                    c.value = [];
                    c.checked = false;
                });
            }
        });

        this.scheduleService.getTimezones()
            .subscribe(res => {
                Object.keys(res).forEach(key => {
                    this.timezones.push({ value: key, label: res[key] });
                });
            });
    }

    applyShift() {

        // APPLY PARAMS
        let params: any = { ids: this.shifts.map(v => v.id) };

        let value;
        // FILTER LIST CHECKED
        const filteredList = Object.keys(this.list).filter(key => this.list[key].checked);
        filteredList.forEach(key => {
            switch (key) {
                case 'shift_date':
                    value = moment(this.list.shift_date.value).format('YYYY-MM-DD');
                    params = { ...params, [key]: value };
                    break;

                case 'shift_start_time':
                case 'shift_end_time':
                    value = moment(this.list[key].value.toString()).format('YYYY-MM-DD HH:mm:ss');
                    params = { ...params, [key]: value };
                    break;

                case 'manager_ids':
                case 'work_area_ids':
                    value = this.list[key].value.length > 0 ? this.list[key].value : null;
                    params = { ...params, [key]: value };
                    break;

                case 'locked':
                case 'live':
                    value = this.list[key].value ? 1 : 0;
                    params = { ...params, [key]: value };
                    break;
            
                default: // If key is one of title, location, generic_location, generic_title, address, contact, notes, timezone
                    params = { ...params, [key]: this.list[key].value};
                    break;
            }
        });

        // FILTER TRACKING CATEGORIES CHECKED
        if (this.categories) {
            const tracking = this.categories.filter(c => c.checked).map(v => {
                return { cat_id: v.id, options: v.value.length > 0 ? v.value : null };
            });
            
            params = { ...params, tracking };
        }

        // FILTER FLAGS CHECKED
        if (this.flags) {
            const flags = this.flags.filter(f => f.checked).map(v => {
                return { id: v.id, set: v.value ? 1 : 0 };
            });

            params = { ...params, flags };
        }

        this.scheduleService.updateMultipleShifts(params).subscribe(res => {
            this.toastr.success(res.message);
        }, err => {
            this.toastr.error(err.error.message);
        })

    }

}
