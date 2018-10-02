import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { CustomLoadingService } from '../../../shared/services/custom-loading.service';
import { PayrollService } from './payroll.service';
import { TabService } from '../../tab/tab.service';
import { Tab } from '../../tab/tab';
import { TokenStorage } from '../../../shared/services/token-storage.service';
import { ActionService } from '../../../shared/services/action.service';
import { Subscription } from 'rxjs';
import { TabComponent } from '../../tab/tab/tab.component';
import { MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { FuseConfirmYesNoDialogComponent } from '../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';
import { FuseConfirmTextYesNoDialogComponent } from '../../../core/components/confirm-text-yes-no-dialog/confirm-text-yes-no-dialog.component';
import { SCMessageService } from '../../../shared/services/sc-message.service';
import {PayrollExportAsCsvDialogComponent} from './dialogs/export-as-csv-dialog/payroll-export-as-csv-dialog.component';

const DEFAULT_PAGE_SIZE = 20;

@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PayrollComponent implements OnInit, OnDestroy {

    // Search parameters
    status = 'all';
    isAdvancedSearch = false;
    from;
    to;
    user;
    usersObservable;

    // Datatable
    payrolls: any[] = [];
    selectedPayrolls: any[] = [];
    isLoading = false;

    pageNumber = 0;
    pageSize = DEFAULT_PAGE_SIZE;
    total = 0;
    pageLengths = [5, 10, 20, 50, 100];
    sorts: any[] = [];
    filters: any[] = [];
    changed = false;

    currentUser: any;
    payrollsChangedSubscription: Subscription;
    tabActivedSubscription: Subscription;

    constructor(
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private tabService: TabService,
        private payrollService: PayrollService,
        private tokenStorage: TokenStorage,
        private actionService: ActionService,
        private scMessageService: SCMessageService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();

        this.usersObservable = (text: string): Observable<any> => {
            return this.payrollService.getUsers(text);
        };

        this.getPayrolls();

        this.payrollsChangedSubscription = this.actionService.payrollsChanged$.subscribe(changed => {
            this.changed = changed;
        });

        this.tabActivedSubscription = this.tabService.tabActived.subscribe((tab: TabComponent) => {
            if (tab && tab.url == 'payroll' && this.changed) {
                setTimeout(() => this.getPayrolls());
            }
        });
    }

    ngOnDestroy() {
        this.payrollsChangedSubscription.unsubscribe();
        this.tabActivedSubscription.unsubscribe();
    }

    onSearchChange(evt: any[]) {
        this.user = [...evt];
        this.getPayrolls();
    }


    onSelect({ selected }) {
        this.selectedPayrolls.splice(0, this.selectedPayrolls.length);
        this.selectedPayrolls.push(...selected);
    }

    onSort(event) {
        this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
        this.getPayrolls();
    }

    onPageLengthChange(event) {
        this.pageSize = event.value;
        this.getPayrolls();
    }

    setPage(pageInfo) {
        this.pageNumber = pageInfo.page - 1;
        this.getPayrolls();
    }

    min(x, y) {
        return Math.min(x, y);
    }

    getPayrolls() {
        this.isLoading = true;
        this.filters = [];
        // Merge filters
        if (this.from) {
            this.from = moment(this.from).format('YYYY-MM-DD');
            this.filters.push(`from:${this.from}`);
        }
        if (this.to) {
            this.to = moment(this.to).format('YYYY-MM-DD');
            this.filters.push(`to:${this.to}`);
        }
        if (this.user && !_.isEmpty(this.user)) {
            this.filters.push(`user:${JSON.stringify(this.user)}`);
        }
        this.payrollService.getPayrolls(this.pageSize, this.pageNumber, this.status, this.filters, this.sorts).subscribe(
            res => {
                this.isLoading = false;
                this.payrolls = [...res.data];
                this.pageSize = res.page_size;
                this.pageNumber = res.page_number;
                this.total = res.total_counts;
            },
            err => {
                this.isLoading = false;
                if (err.status && err.status === 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    process() {
        if (_.isEmpty(this.selectedPayrolls)) { return; }
        const ids = this.selectedPayrolls.map(v => v.id);
        this.payrollService.processPayrolls(ids).subscribe(res => {
            this.toastr.success(res.message);
        });
    }

    // Do action against item
    doAction(item, action) {
        if (action.action == 'pay_xtrm') {
            const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                disableClose: false
            });
            dialogRef.componentInstance.confirmMessage = `Really pay ${item.total}?`;
            dialogRef.afterClosed().subscribe(async(result) => {
                if (result) {
                    try {
                        await this.payrollService.payPayrollWithXtrm(item.id);
                    } catch (e) {
                        this.scMessageService.error(e);
                    }
                }
            });
        } else if (action.action === 'record_processing' || action.action === 'process_xero_payroll' || action.action === 'process_workmarket') {
            const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
              disableClose: false
            });
            dialogRef.componentInstance.confirmMessage = `Are you sure?`;
            dialogRef.afterClosed().subscribe(async (result) => {
              if (result) {
                try {
                  await this.payrollService.processPayrolls([item.id]).toPromise();
                  this.toastr.success('Success!');
                } catch (e) {
                  this.scMessageService.error(e);
                }
              }
            });
        } else if (action.action === 'record_payment') {
            const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
              disableClose: false
            });
            dialogRef.componentInstance.confirmMessage = `Are you sure?`;
            dialogRef.afterClosed().subscribe(async (result) => {
              if (result) {
                try {
                  await this.payrollService.recordPayment([item.id]).toPromise();
                  this.toastr.success('Success!');
                } catch (e) {
                  this.scMessageService.error(e);
                }
              }
            });
        } else if (action.action === 'reject') {
            const dialogRef = this.dialog.open(FuseConfirmTextYesNoDialogComponent, {
                disableClose: false
            });
            dialogRef.componentInstance.confirmMessage = `Are you sure?`;
            dialogRef.componentInstance.placeholder = 'Reason';
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result) {
                    try {
                        await this.payrollService.rejectPayroll(item.id, result).toPromise();
                        this.toastr.success('Success!');
                    } catch (e) {
                        this.scMessageService.error(e);
                    }
                }
            });
        } else if (action.action === 'cancel') {
            const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
              disableClose: false
            });
            dialogRef.componentInstance.confirmMessage = `Are you sure?`;
            dialogRef.afterClosed().subscribe(async (result) => {
              if (result) {
                try {
                  await this.payrollService.deletePayroll(item.id).toPromise();
                  this.toastr.success('Success!');
                } catch (e) {
                  this.scMessageService.error(e);
                }
              }
            });
        }
    }

    open() {
        // Todo - open new browser tab for multiple invoice print
    }

    download() {
        const dialogRef = this.dialog.open(PayrollExportAsCsvDialogComponent, {
          disableClose: false,
          panelClass: 'payroll-export-as-csv-dialog',
          data: {
            payrollIds: this.selectedPayrolls.map(v => +v.id)
          }
        });
        dialogRef.afterClosed().subscribe();
    }

    onActivate(event) {
        if (event.type === 'click' && ['owner', 'admin', 'staff'].indexOf(this.currentUser.lvl) > -1) {
            if (event.cellIndex === 2) {
                const id = event.row.id;
                const tab = new Tab(event.row.display, 'payrollDetailTpl', `payroll/${id}`, { id });
                this.tabService.openTab(tab);
            } else if (event.cellIndex === 3 && this.currentUser.lvl !== 'staff') {
                const user = { id: event.row.user_id };
                const tab = new Tab(`${event.row.name}`, 'usersProfileTpl', `users/user/${user.id}`, user);
                this.tabService.openTab(tab);
            } else { }
        }
    }

}
