import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";
import { AppSettingService } from "../../../../shared/services/app-setting.service";
import { ClientInvoicesService } from "../client-invoices.service";

@Component({
  selector: 'app-client-invoices-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ClientInvoicesDetailComponent implements OnInit {
  @Input() data: any;

  invoice: any = {};
  logoUrl: string;
  receipts: any = {
    images: [],
    others: []
  };

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
      if (this.invoice.lines) {
        for (const item of this.invoice.lines) {
          if (item.receipt) {
            const type = item.receipt.substr(item.receipt.lastIndexOf('/') + 1).toLowerCase();
            if (['png', 'jpg', 'jpeg'].indexOf(type) > -1) {
              this.receipts.images.push({
                url: item.receipt,
                title: item.title
              });
            } else {
              this.receipts.others.push({
                url: item.receipt,
                title: item.title
              });
            }
          }
        }
      }
    } catch (e) {
      this.toastrService.error(e.error.message);
    } finally {
      this.spinner.hide();
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
}
