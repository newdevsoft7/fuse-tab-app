import { Component } from "@angular/core";
import { ClientInvoicesService } from "../client-invoices.service";
import { ToastrService } from "ngx-toastr";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";

import * as moment from 'moment';
import { SCMessageService } from "../../../../shared/services/sc-message.service";

@Component({
  selector: 'app-client-invoice-generator',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss']
})
export class ClientInvoiceGenerateComponent {
  clients: any = [];
  from: any;
  to: any;

  selectedClient: any;

  constructor(
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private clientInvoicesService: ClientInvoicesService,
    private scMessageService: SCMessageService
  ) {}

  clientDisplayFn(client?: any) {
    return client? client.cname : '';
  }

  async generate() {
    try {
      this.spinner.show();
      if (this.from) {
        this.from = moment(this.from).format('YYYY-MM-DD');
      }
      if (this.to) {
        this.to = moment(this.to).format('YYYY-MM-DD');
      }
      await this.clientInvoicesService.generateInvoice(this.selectedClient.id, this.from, this.to);
      this.toastr.success('Invoice generated');
    } catch (e) {
      this.scMessageService.error(e);
    } finally {
      this.spinner.hide();
    }
  }

  checkIfEmpty(value: any) {
    if (!value || typeof value === 'string') {
      this.selectedClient = null;
    } else {
      this.selectedClient = value;
    }
  }

  async filterClients(query: string) {
    if (!query) {
      this.clients = [];
      return;
    }
    try {
      this.clients = await this.clientInvoicesService.searchClients(query).toPromise();
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

}
