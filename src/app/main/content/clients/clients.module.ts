import { NgModule } from "@angular/core";
import { ClientsComponent } from "./clients.component";
import { ClientsService } from "./clients.service";
import { SharedModule } from "../../../core/modules/shared.module";
import { CommonModule } from "@angular/common";
import { ClientFormDialogComponent } from "./dialogs/client-form/client-form.component";
import { TimelineModule } from "../home/timeline/timeline.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TimelineModule
  ],
  declarations: [
    ClientsComponent,
    ClientFormDialogComponent
  ],
  exports: [
    ClientsComponent
  ],
  providers: [ClientsService],
  entryComponents: [
    ClientFormDialogComponent
  ]
})
export class ClientsModule {}
