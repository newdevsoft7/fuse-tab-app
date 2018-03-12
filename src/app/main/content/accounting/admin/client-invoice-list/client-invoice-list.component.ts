import {
	Component, OnInit, ViewEncapsulation,
	ViewChild
} from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';

import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TabService } from '../../../../tab/tab.service';

@Component({
	selector: 'app-client-invoice-list',
	templateUrl: './client-invoice-list.component.html',
	styleUrls: ['./client-invoice-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ClientInvoiceListComponent implements OnInit {

	@ViewChild(DatatableComponent) table: DatatableComponent;

	loadingIndicator: boolean = true; // Datatable loading indicator

	invoices: any[] = [];
	columns: any[] = [];
	filters = [];
	sorts: any[] = [];

	hiddenColumns = ['id'];

	pageNumber: number;
	pageSize = 10;
	total: number;
	pageLengths = [10, 25, 50, 100, 200, 300];

	constructor(
		private toastr: ToastrService,
		private tabService: TabService
	) { }

	ngOnInit() {
		this.getInvoices();
	}

	// GET INVOICES BY FILTERS, PAGE, SORTS
	getInvoices(params = null) {
		// const query = {
		// 	filters: this.filters,
		// 	pageSize: this.pageSize,
		// 	pageNumber: this.pageNumber,
		// 	sorts: this.sorts,
		// 	...params
		// };

		// this.loadingIndicator = true;

		// this.accountingService.getInvoices(query).subscribe(
		// 	res => {
		// 		this.loadingIndicator = false;
		// 		this.invoices = res.data;
		// 		this.columns = res.columns;
		// 		this.pageSize = res.page_size;
		// 		this.pageNumber = res.page_number;
		// 		this.total = res.total_counts;
		// 	},
		// 	err => {
		// 		this.loadingIndicator = false;
		// 		if (err.status && err.status === 403) {
		// 			this.toastr.error('You have no permission!');
		// 		}
		// 	}
		// );
	}

	// DATATABLE SORT
	onSort(event) {
		this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
		this.getInvoices();
	}

	// DATATABLE PAGINATION
	setPage(pageInfo) {
		this.pageNumber = pageInfo.page - 1;
		this.getInvoices();
	}

	onFiltersChanged(filters) {
		this.filters = filters;
		this.getInvoices();
	}

	// PAGE LENGTH SELECTOR
	onPageLengthChange(event) {
		this.getInvoices({ pageSize: event.value });
	}

}
