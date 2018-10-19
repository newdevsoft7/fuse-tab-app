import { Component, OnInit, ViewChild } from "@angular/core";
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { ScheduleService } from "../schedule/schedule.service";
import { ToastrService } from "ngx-toastr";
import { MatDatepickerInputEvent } from "@angular/material";
import { TabService } from "../../tab/tab.service";
import { Tab } from "../../tab/tab";
import { TokenStorage } from "../../../shared/services/token-storage.service";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  data: any = [];
  filtersObservable: any;
  period = {
    from: moment().startOf('month').toDate(),
    to: moment().endOf('month').toDate()
  };
  filters: any;
  tmpFilters: any;
  loadingIndicator: boolean = false;
  pageNumber: number;
  pageSize = 10;
  total: number;
  pageLengths = [10, 25, 50, 100, 200, 300];
  sorts: any[];
  columns: any;
  hiddenColumns: any = ['id', 'status', 'border_color', 'bg_color', 'font_color', 'shift_group_id'];
  summaryData: any = {};
  currentUserFlags: any;
  isSingle: boolean = false;
  selectedFlags: any;

  showBillData: boolean = true;

  @ViewChild('table') table: any;

  constructor(
    private toastr: ToastrService,
    private tabService: TabService,
    private tokenStorage: TokenStorage,
    private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.filtersObservable = (text: string): Observable<any> => {
      const from = moment(this.period.from).format('YYYY-MM-DD');
      const to = moment(this.period.to).format('YYYY-MM-DD');
      return this.scheduleService.getShiftFilters(from, to, text);
    };

    this.currentUserFlags = this.tokenStorage.getSettings();
    this.currentUserFlags.flags.map(flag => flag.set = 2);

    if (this.tokenStorage.getUser().lvl === 'admin' && !this.tokenStorage.getPermissions().admin_bill) {
      this.showBillData = false;
    }

    this.getSummary();
  }

  onFiltersChanged(filters) {
    this.tmpFilters = this.filters = filters.map(v => v.id);
    this.getSummary();
  }

  private async getSummary(params = {}) {
    const mergedParams = {
      filters: this.filters,
      from: moment(this.period.from).format('YYYY-MM-DD'),
      to: moment(this.period.to).format('YYYY-MM-DD'),
      sorts: this.sorts,
      view: 'summary',
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      ...params
    };

    this.loadingIndicator = true;

    try {
      const res = await this.scheduleService.getShifts(mergedParams).toPromise();
      this.data = res.data.map(shift => {
        for (const key in shift) {
          if (key !== 'shift_roles' && typeof shift[key] === 'object') {
            shift[key] = this.getPriceList(shift[key]);
          }
        }
        shift.shift_roles = shift.shift_roles.map(role => {
          for (const key in role) {
            if (key !== 'role_staff' && typeof role[key] === 'object') {
              role[key] = this.getPriceList(role[key]);
            }
          }
          return role;
        });
        return shift;
      });
      this.columns = res.columns;
      this.pageSize = res.page_size;
      this.pageNumber = res.page_number;
      this.total = res.total_counts;
      this.summaryData.total_selected = res.total_selected;
      this.summaryData.total_required = res.total_required;
      this.summaryData.total_payable = res.total_payable;
      this.summaryData.total_pay = this.getPriceList(res.total_pay);
      this.summaryData.total_hours = res.total_hours;
      this.summaryData.total_pay_items = this.getPriceList(res.total_pay_items);
      this.summaryData.total_bill = this.getPriceList(res.total_bill);
      this.summaryData.total_bill_items = this.getPriceList(res.total_bill_items);
      this.summaryData.profit = this.getPriceList(res.profit);
    } catch (err) {
      if (err.status && err.status === 403) {
        this.toastr.error('You have no permission!');
      }
    } finally {
      this.loadingIndicator = false;
    }
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

  updateFlagFilters() {
    this.selectedFlags = [];
    for (let flag of this.currentUserFlags.flags) {
      if (flag.set !== 2) { 
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

    this.getSummary();
  }

  toggleFlagDblClick(flag) {
    this.isSingle = false;
    flag.set = flag.set === 0 ? 2 : 0;
    this.updateFlagFilters();
  }

  formatDate(date) {
    return date ? moment(date, 'DD/MM/YYYY').format('MM/DD/YY') : '';
  }

  changeDate(event: MatDatepickerInputEvent<Date>, selector = 'from' || 'to') {
    this.period[selector] = event.value;
    this.getSummary();
  }

  onSort(event) {
    this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
    this.getSummary();
  }

  // DATATABLE PAGINATION
  setPage(pageInfo) {
    this.pageNumber = pageInfo.page - 1;
    this.getSummary();
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onPageLengthChange(event) {
    this.getSummary({ pageSize: event.value });
  }

  min(x, y) {
    return Math.min(x, y);
  }

  getTableRowClass(row): string {
    return 'mat-grey-200-bg';
  }

  getChildrenTableRowClass(row): string {
    return 'mat-grey-100-bg';
  }
  
  getPriceList(prices: any): {currency: string, value: number}[] {
    const res = [];
    for (const currency in prices) {
      res.push({
        currency,
        value: prices[currency]
      });
    }
    return res;
  }
}
