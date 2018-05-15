import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../core/modules/shared.module";
import { ClientInvoicesComponent } from "./client-invoices.component";
import { ClientInvoicesService } from "./client-invoices.service";
import { CustomMultiSelectModule } from "../../../core/components/custom-multi-select/custom-multi-select.module";
import { ClientInvoicesDetailComponent } from "./detail/detail.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CustomMultiSelectModule
  ],
  declarations: [
    ClientInvoicesComponent,
    ClientInvoicesDetailComponent
  ],
  exports: [
    ClientInvoicesComponent,
    ClientInvoicesDetailComponent
  ],
  providers: [
    ClientInvoicesService
  ]
})
export class ClientInvoicesModule {}
