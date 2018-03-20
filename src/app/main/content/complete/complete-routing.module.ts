import { Routes, RouterModule } from "@angular/router";
import { CompleteComponent } from "./complete.component";
import { CompleteStepComponent } from "./steps";
import { NgModule } from "@angular/core";

export const routes: Routes = [
  { 
    path: '', 
    component: CompleteComponent,
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full' },
      { path: ':step', component: CompleteStepComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class CompleteRoutingModule {

}
