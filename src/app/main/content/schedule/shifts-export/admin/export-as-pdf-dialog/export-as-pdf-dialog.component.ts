import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ScheduleService } from '../../../schedule.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Tab } from '../../../../../tab/tab';
import { TabService } from '../../../../../tab/tab.service';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';
import { from } from 'rxjs/observable/from';
import { FilterService } from '@shared/services/filter.service';

@Component({
    selector: 'app-admin-export-as-pdf-dialog',
    templateUrl: './export-as-pdf-dialog.component.html',
    styleUrls: ['./export-as-pdf-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminExportAsPdfDialogComponent implements OnInit {
    
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

    columns: any[] = [
        { label: 'Contact', checked: false, name: 'con' },
        { label: 'Logo', checked: true, name: 'logo' },
        { label: 'Profile Picture', checked: false, name: 'ppics' },
        { label: 'Signature Line', checked: false, name: 'sigs' },
        { label: 'Time In/Out Line', checked: false, name: 'tio' },
        {
            label: 'Total Hours Line', checked: false, name: 'thr', populate: {
                label: 'Auto-populate', checked: false, name: 'pophrs'
            }
        },
        { label: 'Unfilled Roles', checked: true, name: 'ufr' },
        { label: "'No pay' staff", checked: true, name: 'np' },
        { label: 'Rating Line', checked: false, name: 'rat' },
        { label: 'Manager Signature Line', checked: false, name: 'msig' }

    ];

    constructor(
        public dialogRef: MatDialogRef<AdminExportAsPdfDialogComponent>,
        private scheduleService: ScheduleService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tokenStorage: TokenStorage,
        private tabService: TabService,
        private scMessageService: SCMessageService,
        private filterService: FilterService
    ) {
        this.shiftIds = data.shiftIds || [];
        this.settings = this.tokenStorage.getSettings();

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
                            name: `dtrack${c.id}`
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


    async export() {
        let data: any = {
            columns: this.columns.filter(v => v.name.indexOf('dtrack') < 0).reduce((a, b) => a = { ...a, [b.name]: b}, {}),
            trackCategories: this.columns.filter(v => v.name.indexOf('dtrack') > -1 && v.checked)
                                         .map(v => { return { label: v.label, id: +v.name.substring(6)}; })
        };
        let body: any = {
            no_pay: this.columns.findIndex(v => v.name === 'np' && v.checked) > -1 ? 1 : 0
        };
        if (this.shiftIds.length > 0) {
            body.shift_ids = this.shiftIds;
        } else {
            const from = moment(this.period.from);
            const to = moment(this.period.to);
            if (!from.isValid() || !to.isValid() || from.isAfter(to) ) { return; }
            data = {
                ...data,
                from,
                to
            };
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
        try {
            const shifts = await this.scheduleService.overview(body);
            data = {
                ...data,
                shifts
            };
            const tab = new Tab('Overview', 'shiftsExportAsPdfTpl', 'shifts/overview', data, true);
            this.tabService.openTab(tab);
            this.dialogRef.close();
        } catch (e) {
            this.scMessageService.error(e);
        }
        
    }

}
