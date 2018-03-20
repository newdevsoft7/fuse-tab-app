import { NgModule } from "@angular/core";
import { CompleteComponent } from "./complete.component";
import { CompleteStepComponent, CompleteStep1Component, CompleteStep2Component, CompleteStep3Component, CompleteStep4Component, CompleteStep5Component, CompleteStep6Component, CompleteStep7Component } from "./steps";
import { SharedModule } from "../../../core/modules/shared.module";
import { CompleteRoutingModule } from "./complete-routing.module";

const stepComponents = [
  CompleteStep1Component,
  CompleteStep2Component,
  CompleteStep3Component,
  CompleteStep4Component,
  CompleteStep5Component,
  CompleteStep6Component,
  CompleteStep7Component
];

@NgModule({
  imports: [
    SharedModule,
    CompleteRoutingModule
  ],
  declarations: [
    CompleteComponent,
    CompleteStepComponent,
    ...stepComponents  
  ]
})
export class CompleteModule {

}
