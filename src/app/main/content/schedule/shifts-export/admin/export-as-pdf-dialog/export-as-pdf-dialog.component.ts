import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ScheduleService } from '../../../schedule.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tab } from '../../../../../tab/tab';
import { TabService } from '../../../../../tab/tab.service';

@Component({
    selector: 'app-admin-export-as-pdf-dialog',
    templateUrl: './export-as-pdf-dialog.component.html',
    styleUrls: ['./export-as-pdf-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminExportAsPdfDialogComponent implements OnInit {
    
    shiftIds: any[];
    groupIds: any[];
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
        private toastr: ToastrService,
        private tabService: TabService
    ) {
        this.shiftIds = data.shiftIds || [];
        this.groupIds = data.groupIds || [];
        this.settings = this.tokenStorage.getSettings();

        this.flags = _.cloneDeep(this.settings.flags);
        this.flags.forEach(f => f.set = 2);
    }

    ngOnInit() {
        this.extraUserInfo$ = (text: string): Observable<any> => {
            return this.scheduleService.getExtraUserInfo(text);
        };

        this.filtersObservable = (text: string): Observable<any> => {
            const from = moment(this.period.from).format('YYYY-MM-DD');
            const to = moment(this.period.to).format('YYYY-MM-DD');
            return this.scheduleService.getShiftFilters(from, to, text);
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
        this.dialogRef.close();
        const tab = new Tab('Exports', 'shiftsExportAsPdfTpl', 'shifts/export', {}, true);
        this.tabService.openTab(tab);
    }

    private displayError(e: any) {
		const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }
}
