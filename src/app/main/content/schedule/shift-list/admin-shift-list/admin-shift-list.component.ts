import {
	Component, OnInit,
    ViewEncapsulation, ViewChild
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
import { AdminExportAsExcelDialogComponent } from '../../shifts-export/admin/export-as-excel-dialog/export-as-excel-dialog.component';
import { ShiftListEmailDialogComponent } from './email-dialog/email-dialog.component';
import { AdminExportAsPdfDialogComponent } from '../../shifts-export/admin/export-as-pdf-dialog/export-as-pdf-dialog.component';
import { SettingsService } from '../../../settings/settings.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';

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
    tmpFilters: any;
    sorts: any[];

    currentUser: any;
    currentUserFlags: any;
    isSingle: boolean = false;
    selectedFlags: any;

    hiddenColumns = ['id', 'status', 'border_color', 'bg_color', 'font_color', 'shift_group_id'];

    pageNumber: number;
    pageSize = 10;
    total: number;
    pageLengths = [10, 25, 50, 100, 200, 300];



    dialogRef: any;
    differ: any;

    hoverPopupData: any;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    // Initialize date range selector
    period = {
        from: moment().startOf('month').toDate(),
        to: moment().endOf('month').toDate()
    };

    filtersObservable; // Filters

    isLegendShow = false;
    shiftStatuses: any[] = [];

	constructor(
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private actionService: ActionService,
        private dialog: MatDialog,
        private spinner: CustomLoadingService,
        private settingsService: SettingsService,
        private scMessageService: SCMessageService
    ) { 
    }

	ngOnInit() {
        this.getShifts();
     
        this.currentUser = this.tokenStorage.getUser();
        this.currentUserFlags = this.tokenStorage.getSettings();
        this.currentUserFlags.flags.map(function(flag){
            return flag.set = 2;
        });
     
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
           params
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
                    //this.toastr.success(res.message);
                    this.shifts.filter(v => ids.includes(v.id)).forEach(shift => {
                        shift.gname = res.shift_group.gname;
                        shift.shift_group_id = res.shift_group.id;
                    });
                } catch (e) {
                    this.spinner.hide();
                    this.scMessageService.error(e);
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
                    this.spinner.hide();
                    //this.toastr.success('Saved.');
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

    copyShift(shift) {
        const url = `schedule/new-shift/${shift.id}`;
        const tab = new Tab('New Shift', 'newShiftTpl', url, { url, shiftId: shift.id });
        this.tabService.openTab(tab);
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
        this.tmpFilters = this.filters = filters.map(v => v.id); 
        this.filters = (this.selectedFlags) ? this.filters.concat(this.selectedFlags) : this.filters ;
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

    formatDate(date) {
        return date ? moment(date, 'DD/MM/YYYY').format('MM/DD/YY') : '';
    }

    deleteShift(shift) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    this.shifts = this.shifts.filter(s => s.id !== shift.id);
                    //this.toastr.success(res.message);
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    // Toggles Flag and Filters the Calendar Values
    toggleFlagClick(flag) {
        this.isSingle = true;
        if (flag.set === 0 ) { return; }
        setTimeout(() => {
        if (this.isSingle === true){
            flag.set = flag.set === 1 ? 2 : 1;
            this.updateFlagFilters();
        }
        }, 250);
        
    }

    toggleFlagDblClick(flag) {
        this.isSingle = false;
        flag.set = flag.set === 0 ? 2 : 0;
        this.updateFlagFilters();
    }

    // Updates the selected flags and concats them into the main filters variable
    updateFlagFilters() {
        this.selectedFlags = [];
        for (let flag of this.currentUserFlags.flags) {
            if (flag.set !== 2) 
              { 
                this.selectedFlags.push(`flag:${flag.id}:${flag.set}`);
              }
          }
        if (this.tmpFilters) {
        this.filters = [];
        this.filters = this.tmpFilters;
        this.filters = this.filters.concat(this.selectedFlags);
        } else {
        this.filters = this.selectedFlags;
        }

        this.getShifts();
    }

    export() {
        const dialogRef = this.dialog.open(AdminExportAsExcelDialogComponent, {
            panelClass: 'admin-shift-exports-as-excel-dialog',
            disableClose: false,
            data: { shiftIds: this.selectedShifts.map(v => v.id) }
        });

        dialogRef.afterClosed().subscribe(() => { });
    }

    overview() {
        const dialogRef = this.dialog.open(AdminExportAsPdfDialogComponent, {
            panelClass: 'admin-shift-exports-as-pdf-dialog',
            disableClose: false,
            data: { shiftIds: this.selectedShifts.map(v => v.id) }
        });

        dialogRef.afterClosed().subscribe(() => { });
    }

    email() {
        const shiftIds = this.selectedShifts.map(v => v.id);
        const dialogRef = this.dialog.open(ShiftListEmailDialogComponent, {
            disableClose: false,
            panelClass: 'admin-shift-email-dialog',
            data: { shiftIds }
        });
        dialogRef.afterClosed().subscribe(() => { });
    }
    
    async getHoverContent(event: any): Promise<any> {
        if (!this.hoverPopupData) {
            this.hoverPopupData = [
                {
                    duration: event.shift_end
                }
            ];
        }
        this.hoverPopupData = [await this.scheduleService.getPopupContent(event.id)];
    }

    async showLegend() {
        this.isLegendShow = true;
        try {
          if (this.currentUser.lvl == 'admin' || this.currentUser.lvl == 'owner') {
            this.shiftStatuses = await this.settingsService.getShiftStatuses();
          } else {
            // TODO - get shift status
          }
        } catch (e) {
          this.scMessageService.error(e);
        }
      }
}
