import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../core/modules/shared.module";
import { ClientInvoicesComponent } from "./client-invoices.component";
import { ClientInvoicesService } from "./client-invoices.service";

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ClientInvoicesComponent
  ],
  exports: [
    ClientInvoicesComponent
  ],
  providers: [
    ClientInvoicesService
  ]
})
export class ClientInvoicesModule {}
