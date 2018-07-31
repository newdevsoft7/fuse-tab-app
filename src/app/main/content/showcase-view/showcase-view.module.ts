import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { ShowcaseViewComponent } from "./showcase-view.component";
import { ShowcaseViewRoutingModule } from "./showcase-view-routing.module";
import { ShowcaseViewService } from "./showcase-view.service";
import { ShowcaseModule } from "../showcase/showcase.module";

@NgModule({
  imports: [
    ShowcaseViewRoutingModule,
    SharedModule,
    ShowcaseModule
  ],
  declarations: [ ShowcaseViewComponent ],
  providers: [
    ShowcaseViewService
  ],
  exports: [ ShowcaseViewComponent ]
})
export class ShowcaseViewModule {}
