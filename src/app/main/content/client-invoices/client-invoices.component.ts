import { Component, OnInit } from "@angular/core";
import { ClientInvoicesService } from "./client-invoices.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
import { TabService } from "../../tab/tab.service";
import { Tab } from "../../tab/tab";

const DEFAULT_PAGE_SIZE = 5;

enum ACTIONS {
  SEND = 'send',
  PAY = 'pay',
  CANCEL = 'cancel'
};

@Component({
  selector: 'app-client-invoices',
  templateUrl: './client-invoices.component.html',
  styleUrls: ['./client-invoices.component.scss']
})
export class ClientInvoicesComponent implements OnInit {

  status: string = 'all';

  invoices: any[] = [];
  selectedInvoices: any[] = [];
  isLoading: boolean = false;

  isAdvancedSearch: boolean = false;

  from: any;
  to: any;
  clients: number[] = [];
  clientsFilterObservable: any;

  pageNumber: number = 0;
  pageSize: number = DEFAULT_PAGE_SIZE;
  total: number = 0;
  pageLengths: number[] = [5, 10, 20, 50, 100];
  sorts: any[] = [];
  filters: any[] = [];

  constructor(
    private toastr: ToastrService,
    private tabService: TabService,
    private clientInvoicesService: ClientInvoicesService
  ) {}

  ngOnInit() {
    this.fetchInvoices();

    this.clientsFilterObservable = (text: string): Observable<any> => {
      if (text) {
        return this.clientInvoicesService.searchClients(text);
      } else {
        return Observable.of([]);
      }
    };
  }

  async fetchInvoices(): Promise<any> {
    try {

      this.filters = [];
      if (this.from) {
          this.from = moment(this.from).format('YYYY-MM-DD');
          this.filters.push(`from:${this.from}`);
      }
      if (this.to) {
          this.to = moment(this.to).format('YYYY-MM-DD');
          this.filters.push(`to:${this.to}`);
      }
      if (this.clients && this.clients.length > 0) {  
          this.filters.push(`client:${JSON.stringify(this.clients)}`);
      }

      this.isLoading = true;

      const res = await this.clientInvoicesService.getInvoices(this.pageSize, this.pageNumber, this.status, this.filters, this.sorts);

      this.invoices = res.data;
      this.pageSize = res.page_size;
      this.pageNumber = res.page_number;
      this.total = res.total_counts;

      this.isLoading = false;
    } catch (e) {
      this.handleError(e);
    }
  }

  onSort(event) {
    this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
    this.fetchInvoices();
  }

  onSelect({ selected }) {
    this.selectedInvoices.splice(0, this.selectedInvoices.length);
    this.selectedInvoices.push(...selected);
  }

  onActivate(event) {
    if (event.type === 'click') {
      const tab = new Tab(event.row.display, 'clientInvoicesDetailTpl', `client-invoices/${event.row.id}`, { id: event.row.id, display: event.row.display });
      this.tabService.openTab(tab);
    }
  }

  async doAction(item, action) {
    switch (action) {
      case ACTIONS.SEND:
          try {
            await this.clientInvoicesService.sendInvoice(item.id);
            this.fetchInvoices();
          } catch (e) {
            this.handleError(e);
          }
          break;
      case ACTIONS.PAY:
          try {
            await this.clientInvoicesService.paidInvoice(item.id);
            this.fetchInvoices();
          } catch (e) {
            this.handleError(e);
          }
          break;
      case ACTIONS.CANCEL:
          try {
            await this.clientInvoicesService.deleteInvoice(item.id);
            this.fetchInvoices();
          } catch (e) {
            this.handleError(e);
          }
          break;
      default:
          break;
    }
  }

  onPageLengthChange(event) {
    this.pageSize = event.value;
    this.fetchInvoices();
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.page - 1;
    this.fetchInvoices();
  }

  min(x, y) {
    return Math.min(x, y);
  }

  showAdvancedSearch() {
    this.isAdvancedSearch = true;
  }

  private handleError(e) {
    this.toastr.error(e.error.message);
  }
}
