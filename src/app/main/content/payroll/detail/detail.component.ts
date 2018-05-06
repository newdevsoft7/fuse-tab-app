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

  payroll: any;
  logoUrl: string;

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
    } catch (e) {
      this.toastrService.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}
