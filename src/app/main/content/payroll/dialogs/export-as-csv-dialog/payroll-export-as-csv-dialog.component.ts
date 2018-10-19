import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PayrollService} from '../../payroll.service';
import {ScheduleService} from '../../../schedule/schedule.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-payroll-export-as-csv-dialog',
  templateUrl: './payroll-export-as-csv-dialog.component.html',
  styleUrls: ['./payroll-export-as-csv-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayrollExportAsCsvDialogComponent implements OnInit {

  extraUserInfo$;
  extraUserInfo: any[] = [];
  payrollIds: number[];
  showReimbursements = false;
  showLineItems = false;

  constructor(
    public dialogRef: MatDialogRef<PayrollExportAsCsvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private payrollService: PayrollService,
    private scheduleService: ScheduleService
  ) {
    this.payrollIds = data.payrollIds;
    this.getOptionsFromLocalStorage();
  }

  getOptionsFromLocalStorage() {
    this.showReimbursements = JSON.parse(localStorage.getItem('showReimbursements')) || false;
    this.showLineItems = JSON.parse(localStorage.getItem('showLineItems')) || false;
    this.extraUserInfo = JSON.parse(localStorage.getItem('extraUserInfo')) || [];
  }

  setOptionsToLocalStorage() {
    localStorage.setItem('showReimbursements', JSON.stringify(this.showReimbursements));
    localStorage.setItem('showLineItems', JSON.stringify(this.showLineItems));
    localStorage.setItem('extraUserInfo', JSON.stringify(this.extraUserInfo));
  }

  ngOnInit() {
    this.extraUserInfo$ = (text: string): Observable<any> => {
      return this.scheduleService.getExtraUserInfo(text);
    };
  }

  async export() {
    this.setOptionsToLocalStorage();
    const payloads: any = {
      payroll_ids: this.payrollIds,
      show_reimbursements: this.showReimbursements,
      show_line_items: this.showLineItems,
    };
    if (this.extraUserInfo.length > 0) {
      payloads.extra_info = this.extraUserInfo.map(v => v.id);
    }
    this.payrollService.downloadPayrollsAsXlsx(payloads);
    this.dialogRef.close();
  }

}
