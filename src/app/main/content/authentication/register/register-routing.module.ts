import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./register.component";
import { NgModule } from "@angular/core";
import { RegisterStepComponent } from "./steps";

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full' },
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
