import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ShowcaseViewComponent } from "./showcase-view.component";

const routes: Route[] = [
  { path: '', component: ShowcaseViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowcaseViewRoutingModule {}
