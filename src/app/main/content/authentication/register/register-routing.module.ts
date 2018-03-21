import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./register.component";
import { NgModule } from "@angular/core";
import { RegisterStepComponent } from "./steps";

export const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    children: [
      { path: '', component: RegisterStepComponent },
      { path: ':step', component: RegisterStepComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class RegisterRoutingModule {

}
