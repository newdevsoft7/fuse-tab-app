import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../core/modules/shared.module";

import { RegisterComponent } from "./register.component";
import {
  RegisterStepComponent, RegisterStep1Component,
  RegisterStep2Component, RegisterStep3Component,
  RegisterStep4Component, RegisterStep5Component,
  RegisterStep6Component, RegisterStep7Component,
  RegisterStep0Component,
} from "./steps";
import { RegisterRoutingModule } from "./register-routing.module";

const stepComponents = [
  RegisterStep0Component,
  RegisterStep1Component,
  RegisterStep2Component,
  RegisterStep3Component,
  RegisterStep4Component,
  RegisterStep5Component,
  RegisterStep6Component,
  RegisterStep7Component
];

@NgModule({
  imports: [
    SharedModule,
    RegisterRoutingModule
  ],
  declarations: [
    RegisterComponent,
    RegisterStepComponent,
    ...stepComponents
  ]
})
export class RegisterModule {

}
