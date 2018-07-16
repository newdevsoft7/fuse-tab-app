import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { CustomLoadingService } from '../../../shared/services/custom-loading.service';
import { PayrollService } from './payroll.service';
import { TabService } from '../../tab/tab.service';
import { Tab } from '../../tab/tab';
import { TokenStorage } from '../../../shared/services/token-storage.service';

const DEFAULT_PAGE_SIZE = 5;

@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PayrollComponent implements OnInit {

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

    currentUser: any;

    constructor(
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private tabService: TabService,
        private payrollService: PayrollService,
        private tokenStorage: TokenStorage
    ) { }

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();

        this.usersObservable = (text: string): Observable<any> => {
            return this.payrollService.getUsers(text);
        };

        this.getPayrolls();
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
                this.payrolls = res.data;
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

    }

    onActivate(event) {
        if (event.type === 'click' && ['owner', 'admin'].indexOf(this.currentUser.lvl) > -1) {
            if (event.cellIndex === 2) {
                const id = event.row.id;
                const tab = new Tab(event.row.display, 'payrollDetailTpl', `payroll/${id}`, { id });
                this.tabService.openTab(tab);
            } else if (event.cellIndex === 3) {
                const user = { id: event.row.user_id };
                const tab = new Tab(`${event.row.name}`, 'usersProfileTpl', `users/user/${user.id}`, user);
                this.tabService.openTab(tab);
            } else { }
        }
    }
}
