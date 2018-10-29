import { Component, OnInit, Input } from "@angular/core";
import { PayrollService } from "../payroll.service";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { AppSettingService } from "../../../../shared/services/app-setting.service";
import { MatDialog } from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { FuseConfirmYesNoDialogComponent } from "../../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component";
import { FuseConfirmTextYesNoDialogComponent } from "../../../../core/components/confirm-text-yes-no-dialog/confirm-text-yes-no-dialog.component";
import { SCMessageService } from "../../../../shared/services/sc-message.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class PayrollDetailComponent implements OnInit {
  @Input() data: any;

  payrolls: any[] = []; // used for multiple payrolls detail.
  payroll: any = {}; // used for a single payroll detail.

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
    private scMessageService: SCMessageService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.logoUrl = this.appSettingService.baseData.logo;
    try {
      this.spinner.show();
      if (this.data.ids) { // Multiple payrolls detail
        this.payrolls = await this.payrollService.getMultiPayrollsDetail(this.data.ids);
      } else { // Single payroll detail
        this.payroll = await this.payrollService.getSinglePayrollDetail(this.data.id);
        this.payrolls.push(this.payroll);
      }
      this.flattenPayrolls();
    } catch (e) {
      this.scMessageService.error(e);
    } finally {
      this.spinner.hide();
    }
  }

  flattenPayrolls() {
    this.payrolls.forEach(payroll => this.flattenSinglePayroll(payroll));
  }

  flattenSinglePayroll(payroll) {
    payroll.items = [];
    payroll.receipts = {
      images: [],
      others: []
    };
    for (const key in payroll) {
      if (this.itemTypes.find(type => type.value === key)) {
        for (const item of payroll[key]) {
          item.type = key;
          payroll.items.push(item);
          if (item.receipt) {
            const type = item.receipt.substr(item.receipt.lastIndexOf('/') + 1).toLowerCase();
            if (['png', 'jpg', 'jpeg'].indexOf(type) > -1) {
              payroll.receipts.images.push({
                url: item.receipt,
                title: item.title
              });
            } else {
              payroll.receipts.others.push({
                url: item.receipt,
                title: item.title
              });
            }
          }
        }
      }
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
            this.refreshActionsStatus();
            this.toastr.success('Success!');
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
            await this.payrollService.processPayrolls([this.payroll.id]).toPromise();
            this.refreshActionsStatus();
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
            await this.payrollService.recordPayment([this.payroll.id]).toPromise();
            this.refreshActionsStatus();
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
            await this.payrollService.rejectPayroll(this.payroll.id, result).toPromise();
            this.refreshActionsStatus();
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
            await this.payrollService.deletePayroll(this.payroll.id).toPromise();
            this.refreshActionsStatus();
            this.toastr.success('Success!');
          } catch (e) {
            this.scMessageService.error(e);
          }
        }
      });
    }
  }

  getBGColor(status: string) {
    let color = '#fbc02d';
    switch (status.toLowerCase()) {
      case 'paid':
        color = 'green';
        break;

      case 'rejected':
        color = 'red';
        break;

      case 'processing':
        color = 'orange';
        break;
    }
    return color;
  }

  async refreshActionsStatus() {
    try {
      const payroll = await this.payrollService.getSinglePayrollDetail(this.data.id);
      this.payroll.actions = payroll.actions;
      this.payroll.status = payroll.status;
      this.payrolls[0].actions = payroll.actions;
      this.payrolls[0].status = payroll.status;
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

}
