import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../core/modules/shared.module";
import { OutsourceCompaniesComponent } from "./outsource-companies.component";
import { OutsourceCompaniesService } from "./outsource-companies.service";
import { OutsourceCompanyFormComponent } from "./dialogs/outsource-company-form/outsource-company-form.component";
import { TimelineModule } from "../home/timeline/timeline.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TimelineModule
  ],
  declarations: [
    OutsourceCompaniesComponent,
    OutsourceCompanyFormComponent
  ],
  providers: [
    OutsourceCompaniesService
  ],
  exports: [
    OutsourceCompaniesComponent
  ],
  entryComponents: [
    OutsourceCompanyFormComponent
  ]
})
export class OutsourceCompaniesModule {}
