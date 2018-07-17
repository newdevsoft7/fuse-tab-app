import { Component, OnInit, Input } from "@angular/core";
import { PayrollService } from "../payroll.service";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { AppSettingService } from "../../../../shared/services/app-setting.service";
import { MatDialog } from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";

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
    private toastr: ToastrService,
    private spinner: CustomLoadingService,
    private appSettingService: AppSettingService,
    private payrollService: PayrollService,
    private dialog: MatDialog
  ) { }

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
      this.displayError(e);
    } finally {
      this.spinner.hide();
    }
  }

  async doAction(action) {
    if (action.action == 'pay_xtrm') {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      dialogRef.componentInstance.confirmMessage = `Really pay ${this.payroll.total}?`;
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          try {
            await this.payrollService.payPayrollWithXtrm(this.payroll.id);
          } catch (e) {
            this.displayError(e);
          }
        }
      });
    }
  }


  private displayError(e) {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    }
    else {
      this.toastr.error(e.error.message);
    }
  }
}
