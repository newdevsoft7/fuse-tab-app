import { Component, OnInit, Input } from "@angular/core";
import { PayrollService } from "../payroll.service";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { AppSettingService } from "../../../../shared/services/app-setting.service";

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class PayrollDetailComponent implements OnInit {
  @Input() data: any;

  payroll: any = {};
  payrollItems: any = [];
  logoUrl: string;

  readonly itemTypes = [
    { value: 'bonus', title: 'Bonus' },
    { value: 'deduction', title: 'Deduction' },
    { value: 'expense', title: 'Expense' },
    { value: 'shift', title: 'Shift' },
    { value: 'travel', title: 'Travel' },
    { value: 'other', title: 'Other' }
  ];

  readonly columns = [
    { prop: 'type' },
    { prop: 'title' },
    { prop: 'u_amt', name: 'UNIT PRICE' },
    { prop: 'qty', name: 'QUANTITY' },
    { prop: 'l_amt', name: 'TOTAL' }
  ];

  constructor(
    private toastrService: ToastrService,
    private spinner: CustomLoadingService,
    private appSettingService: AppSettingService,
    private payrollService: PayrollService) {}

  async ngOnInit() {
    this.logoUrl = this.appSettingService.baseData.logo;
    try {
      this.spinner.show();
      this.payroll = await this.payrollService.getPayroll(this.data.id).toPromise();
      const payrollItems = [];
      for (let key in this.payroll) {
        if (this.itemTypes.find(type => type.value === key)) {
          for (let item of this.payroll[key]) {
            item.type = key;
            payrollItems.push(item);
          }
        }
      }
      this.payrollItems = payrollItems;
    } catch (e) {
      this.toastrService.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}
