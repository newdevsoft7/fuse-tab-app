import { Component, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";
import { AppSettingService } from "../../../../shared/services/app-setting.service";
import { ClientInvoicesService } from "../client-invoices.service";

@Component({
  selector: 'app-client-invoices-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ClientInvoicesDetailComponent {
  @Input() data: any;

  invoice: any = {};
  logoUrl: string;

  constructor(
    private toastrService: ToastrService,
    private spinner: CustomLoadingService,
    private appSettingService: AppSettingService,
    private clientInvoicesService: ClientInvoicesService) {}

  async ngOnInit() {
    this.logoUrl = this.appSettingService.baseData.logo;
    try {
      this.spinner.show();
      this.invoice = await this.clientInvoicesService.getInvoice(this.data.id);
    } catch (e) {
      this.toastrService.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  getBGColor(status: string) {
    let color: string = 'yellow';
    switch (status.toLowerCase()) {
      case 'paid':
        color = 'green';
        break;

      case 'rejected':
        color = 'red';
        break;

      default:
        color = 'orange';
        break;
    }
    return color;
  }
}
