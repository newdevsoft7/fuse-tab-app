import { NgModule } from "@angular/core";
import { SummaryComponent } from "./summary.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../core/modules/shared.module";
import { SummaryService } from "./summary.service";
import { CustomMultiSelectGroupModule } from "../../../core/components/custom-multi-select-group/custom-multi-select-group.module";
import { PopoverModule } from "../../../core/components/sc-calendar/popover";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CustomMultiSelectGroupModule,
    PopoverModule
  ],
  providers: [SummaryService],
  declarations: [SummaryComponent],
  exports: [SummaryComponent]
})
export class SummaryModule {

}
