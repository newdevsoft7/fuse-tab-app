import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ScheduleService } from '../../../schedule.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { FilterService } from '@shared/services/filter.service';
import { from } from 'rxjs/observable/from';

@Component({
    selector: 'app-admin-export-as-excel-dialog',
    templateUrl: './export-as-excel-dialog.component.html',
    styleUrls: ['./export-as-excel-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminExportAsExcelDialogComponent implements OnInit {

    shiftIds: any[];
    settings: any = {};
    flags: any[] = [];
    selectedFlags: any[] = [];

    extraUserInfo$;
    extraUserInfo: any[] = [];

    filtersObservable; // Filters
    filter: any[] = [];

    categories: any[] = []; // Tracking categories and options

    period = {
        from: moment().format('YYYY-MM-DD'),
        to: moment().add(7, 'day').format('YYYY-MM-DD')
    };

    // Options
    options: any[] = [
        { label: 'Unfilled only', checked: false, name: 'unfilled' },
        { label: 'Include reports', checked: false, name: 'reports' },
        { label: 'Group by shift', checked: false, name: 'gbs' }
    ];

    // Staff statues
    staffStatues: any[] = [
        { label: 'Selected', checked: true, name: 'ss_sel' },
        { label: 'Checked In', checked: true, name: 'ss_cin' },
        { label: 'Completed', checked: true, name: 'ss_comp' },
        { label: 'Other', checked: false, name: 'ss_oth' },
        { label: 'Confirmed', checked: true, name: 'ss_conf' },
        { label: 'Checked Out', checked: true, name: 'ss_cout' },
        { label: 'Invoiced', checked: true, name: 'ss_inv' },
        { label: 'No Show', checked: false, name: 'ss_ns' },
        { label: 'Replacement Requested', checked: true, name: 'ss_rep' },
        { label: 'Paid', checked: true, name: 'ss_pd' },
    ];

    columns: any[] = [
        { label: 'Title', checked: false, name: 'ecol_title' },
        { label: 'Client', checked: false, name: 'ecol_client' },
        { label: 'Date', checked: true, name: 'ecol_date' },
        { label: 'Times', checked: true, name: 'ecol_times' },
        { label: 'Location', checked: true, name: 'ecol_loc' },
        { label: 'Group', checked: false, name: 'ecol_group' },
        { label: 'Work areas', checked: false, name: 'ecol_workarea' },
        { label: 'Address', checked: false, name: 'ecol_addr' },
        { label: 'Contact', checked: false, name: 'ecol_con' },
        { label: 'Manager', checked: false, name: 'ecol_man' },
        { label: 'Flags', checked: false, name: 'ecol_flags' },
        { label: 'Shift Status', checked: false, name: 'ecol_sstat' },
        { label: 'Shift Expenses', checked: false, name: 'ecol_sexp' },
        { label: 'Admin Notes', checked: false, name: 'ecol_anotes' },
        { label: 'Role', checked: true, name: 'ecol_role' },
        { label: 'Number', checked: false, name: 'ecol_num' },
        { label: 'Sex', checked: false, name: 'ecol_sex' },
        { label: 'Hours', checked: false, name: 'ecol_hrs' },
        { label: 'Break', checked: false, name: 'ecol_break' },
        { label: 'Client Rate', checked: false, name: 'ecol_crate' },
        { label: 'Client Rate Type', checked: false, name: 'ecol_crtype' },
        { label: 'Staff Rate', checked: false, name: 'ecol_rate' },
        { label: 'Staff Rate Type', checked: false, name: 'ecol_rtype' },
        { label: 'Total Payable', checked: false, name: 'ecol_tpayable' },
        { label: 'Total Billable', checked: false, name: 'ecol_tbillable' },
        { label: 'Agency', checked: false, name: 'ecol_agency' },
        { label: 'Staff', checked: true, name: 'ecol_staff' },
        { label: 'Mobile', checked: false, name: 'ecol_mob' },
        { label: 'Email', checked: false, name: 'ecol_email' },
        { label: 'Staff Status', checked: false, name: 'ecol_ustatus' },
        { label: 'Check-In', checked: false, name: 'ecol_checkin' },
        { label: 'Check-Out', checked: false, name: 'ecol_checkout' },
        { label: 'Staff Expenses', checked: false, name: 'ecol_exps' },
    ];

    constructor(
        public dialogRef: MatDialogRef<AdminExportAsExcelDialogComponent>,
        private scheduleService: ScheduleService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokenStorage: TokenStorage,
        private filterService: FilterService
    ) {
        this.shiftIds = data.shiftIds || [];
        this.settings = this.tokenStorage.getSettings();

        if (+this.settings.client_enable === 0) {
            const index = this.columns.findIndex(c => c.name === 'ecol_client');
            this.columns.splice(index, 1);
        }

        if (+this.settings.work_areas_enable === 0) {
            const index = this.columns.findIndex(c => c.name === 'ecol_workarea');
            this.columns.splice(index, 1);
        }

        if (+this.settings.locations_enable === 0) {
            const index = this.columns.findIndex(c => c.name === 'ecol_addr');
            this.columns.splice(index, 1);
        }

        this.flags = _.cloneDeep(this.settings.flags);
        this.flags.forEach(f => f.set = 2);
    }

    ngOnInit() {
        this.extraUserInfo$ = (text: string): Observable<any> => {
            return this.scheduleService.getExtraUserInfo(text);
        };

        this.filterService.clean(this.filterService.type.shifts);

        this.filtersObservable = (text: string): Observable<any> => {
            const fromDate = moment(this.period.from).format('YYYY-MM-DD');
            const toDate = moment(this.period.to).format('YYYY-MM-DD');
            return from(this.filterService.getShiftFilters(fromDate, toDate, text));
        };

        this.scheduleService.getShiftsData().subscribe(res => {
            if (res.tracking) {
                this.categories = res.tracking;
                this.categories.forEach(c => {
                    this.columns.push(
                        {
                            label: c.cname,
                            checked: false,
                            name: `ecol_track${c.id}`
                        }
                    );
                });
            }
        });
    }

    changeDate(event: MatDatepickerInputEvent<Date>, selector = 'from' || 'to') {
        this.period[selector] = event.value;
        this.filterService.clean(this.filterService.type.shifts);
    }

    // Toggles Flag and Filters the Calendar Values
    toggleFlagClick(flag) {
        if (flag.set === 0 ) { return; }
        flag.set = flag.set === 1 ? 2 : 1;
        this.updateFlagFilters();
        
    }

    toggleFlagDblClick(flag) {
        flag.set = flag.set === 0 ? 2 : 0;
        this.updateFlagFilters();
    }

    updateFlagFilters() {
        this.selectedFlags = [];
        this.flags.forEach(flag => {
            if (flag.set !== 2) {
                this.selectedFlags.push(`flag:${flag.id}:${flag.set}`);
            }
        });
    }

    export() {
        let body: any = {};
        this.options.filter(v => v.checked).forEach(v => body[v.name] = 1);
        this.columns.filter(v => v.checked).forEach(v => body[v.name] = 1);
        this.staffStatues.filter(v => v.checked).forEach(v => body[v.name] = 1);
        if (this.shiftIds.length > 0) {
            body.shift_ids = this.shiftIds;
        } else {
            const from = moment(this.period.from);
            const to = moment(this.period.to);
            if (!from.isValid() || !to.isValid() ) { return; }
            body = {
                ...body,
                from: from.format('YYYY-MM-DD'),
                to: to.format('YYYY-MM-DD')
            };
            body.filter = [];
            if (this.selectedFlags.length > 0) {
                this.selectedFlags.forEach(v => body.filter.push(v));
            }
            if (this.filter.length > 0) {
                this.filter.forEach(v => body.filter.push(v.id));
            }
        }

        if (this.extraUserInfo.length > 0) {
            body.extra_info = this.extraUserInfo.map(v => v.id);
        }
        this.scheduleService.exportAsXlsx(body);
        this.dialogRef.close();
    }

}
