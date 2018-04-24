import {
	Component, OnInit,
	ViewEncapsulation, ViewChild,
	ElementRef, Input
} from '@angular/core';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';

import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { fuseAnimations } from '../../../../../core/animations';

import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { TabService } from '../../../../tab/tab.service';
import { ActionService } from '../../../../../shared/services/action.service';
import { Tab } from '../../../../tab/tab';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-admin-shift-list',
	templateUrl: './admin-shift-list.component.html',
    styleUrls: ['./admin-shift-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdminShiftListComponent implements OnInit {
    
    loadingIndicator: boolean = true; // Datatable loading indicator

    shifts: any[];
    selectedShifts: any[] = [];
    columns: any[];
    filters = [];
    sorts: any[];

    hiddenColumns = ['id', 'status', 'border_color', 'bg_color', 'font_color', 'shift_group_id'];

    pageNumber: number;
    pageSize = 10;
    total: number;
    pageLengths = [10, 25, 50, 100, 200, 300];

    dialogRef: any;
    differ: any;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    // Initialize date range selector
    period = {
        from: moment().startOf('month').toDate(),
        to: moment().endOf('month').toDate()
    };

    filtersObservable; // Filters

	constructor(
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private actionService: ActionService,
        private dialog: MatDialog,
        private spinner: CustomLoadingService
    ) { 
    }

	ngOnInit() {
        this.getShifts();
        this.filtersObservable = (text: string): Observable<any> => {
            const from = moment(this.period.from).format('YYYY-MM-DD');
            const to = moment(this.period.to).format('YYYY-MM-DD');
            return this.scheduleService.getShiftFilters(from, to, text);
        };
    }
    
    // GET SHIFTS BY FILTERS, PAGE, SORTS
    getShifts(params = null) {
        const query = {
            filters: this.filters,
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            sorts: this.sorts,
            from: moment(this.period.from).format('YYYY-MM-DD'),
            to: moment(this.period.to).format('YYYY-MM-DD'),
            ...params
        };

        this.loadingIndicator = true;

        this.scheduleService.getShifts(query).subscribe(
            res => {
                this.loadingIndicator = false;
                this.shifts = res.data;
                this.columns = res.columns;
                this.pageSize = res.page_size;
                this.pageNumber = res.page_number;
                this.total = res.total_counts;
            },
            err => {
                this.loadingIndicator = false;
                if (err.status && err.status === 403) {
                    this.toastr.error('You have no permission!');
                }
            }
        )
    }

    async group() {
        const ids = this.selectedShifts.map(v => v.id);
        const dialogRef = this.dialog.open(GroupDialogComponent, {
            disableClose: false,
            panelClass: 'group-dialog',
            data: {
                count: this.selectedShifts.length
            }
        });
        dialogRef.afterClosed().subscribe(async (groupName) => {
            if (groupName) {
                try {
                    this.spinner.show();
                    const res = await this.scheduleService.groupShifts({
                        gname: groupName,
                        shift_ids: this.selectedShifts.map(s => s.id.toString())
                    });
                    this.spinner.hide();
                    this.toastr.success(res.message);
                    this.shifts.filter(v => ids.includes(v.id)).forEach(shift => {
                        shift.gname = res.shift_group.gname;
                        shift.shift_group_id = res.shift_group.id;
                    });
                } catch (e) {
                    this.spinner.hide();
                    this.displayError(e);
                }
            }
        });

    }

    ungroup() {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        const groupIds = _.uniq(this.selectedShifts.map(v => v.shift_group_id));
        const shiftIds = this.selectedShifts.map(v => v.id.toString());

        const count = this.selectedShifts.length;
        dialogRef.componentInstance.confirmMessage = `Really ungroup ${count} ${count > 1 ? 'shifts' : 'shift'}`;
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    this.spinner.show();
                    const res = await this.scheduleService.ungroupGroups(groupIds, shiftIds);
                    this.spinner.hide();
                    this.toastr.success('Saved.');
                    this.shifts.filter(v => shiftIds.includes(v.id.toString())).forEach(shift => {
                        shift.gname = null;
                        shift.shift_group_id = null;
                    });
                } catch (e) {
                    this.spinner.hide();
                    this.toastr.error('Error occured!');
                }
            }
        });
    }

    // DATATABLE SORT
    onSort(event) {
        this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
        this.getShifts();
    }

    // DATATABLE PAGINATION
    setPage(pageInfo) {
        this.pageNumber = pageInfo.page - 1;
        this.getShifts();
    }

    // SELECT SHIFTS
    onSelect({ selected }) {
        this.selectedShifts.splice(0, this.selectedShifts.length);
        this.selectedShifts.push(...selected);
    }

    // PAGE LENGTH SELECTOR
    onPageLengthChange(event) {
        this.getShifts({ pageSize: event.value });
    }

    min(x, y) {
        return Math.min(x, y);
    }

    changeDate(event: MatDatepickerInputEvent<Date>, selector = 'from' || 'to') {
        this.period[selector] = event.value;
        this.getShifts();
    }

    onFiltersChanged(filters) {
        this.filters = filters;
        this.getShifts();
    }

    // Open Shifts edit tab for multiple shifts
    editShifts() {
        const tab = new Tab('Shifts Edit', 'editShiftTpl', 'admin/shift/edit', { shifts: this.selectedShifts });
        this.tabService.openTab(tab);
        this.actionService.addShiftsToEdit(this.selectedShifts);
    }

    // Open Shifts edit tab for a shift
    editShift(shift) {
        const shifts = [shift];
        const tab = new Tab('Shifts Edit', 'editShiftTpl', 'admin/shift/edit', { shifts });
        this.tabService.openTab(tab);
        this.actionService.addShiftsToEdit(shifts);
    }

    openShift(shift) {
        const id = shift.id;
        const url = `admin/shift/${id}`;
        const tab = new Tab(shift.title, 'adminShiftTpl', url, { id, url });
        this.tabService.openTab(tab);
    }

    openGroup(shift) {
        const tab = new Tab(
            shift.gname,
            'adminShiftGroupTpl',
            `admin-shift/group/${shift.shift_group_id}`,
            { id: shift.shift_group_id }
        );
        this.tabService.openTab(tab);
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
