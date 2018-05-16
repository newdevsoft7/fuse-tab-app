import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../core/modules/shared.module";

import { RegisterComponent } from "./register.component";
import {
  RegisterStepComponent, RegisterStep1Component,
  RegisterStep2Component, RegisterStep3Component,
  RegisterStep4Component, RegisterStep5Component,
  RegisterStep6Component, RegisterStep7Component,
  RegisterStep0Component, RegisterStep8Component
} from "./steps";

import {
  // Profile Step
  RegisterProfileEditDateComponent,
  RegisterProfileEditListValueComponent,
  RegisterProfileEditSexComponent,
  RegisterProfileEditTextValueComponent,
  RegisterProfileEditListmValueComponent,
  // Photo Step
  RegisterPhotoGalleryDialogComponent,
  RegisterVideoGalleryDialogComponent,
  // Experience Step
  RegisterExperienceFormDialogComponent
} from "./steps";
import { RegisterRoutingModule } from "./register-routing.module";
import { UserService } from "../../users/user.service";
import { RegisterService } from "./register.service";

const stepComponents = [
  RegisterStep0Component,
  RegisterStep1Component,
  RegisterStep2Component,
  RegisterStep3Component,
  RegisterStep4Component,
  RegisterStep5Component,
  RegisterStep6Component,
  RegisterStep7Component,
  RegisterStep8Component
];

const profileEditComponents = [
  RegisterProfileEditDateComponent,
  RegisterProfileEditListValueComponent,
  RegisterProfileEditSexComponent,
  RegisterProfileEditTextValueComponent,
  RegisterProfileEditListmValueComponent
];

@NgModule({
  imports: [
    SharedModule,
    RegisterRoutingModule
  ],
  declarations: [
    RegisterComponent,
    RegisterStepComponent,
    ...stepComponents,
    ...profileEditComponents,
    RegisterPhotoGalleryDialogComponent,
    RegisterVideoGalleryDialogComponent,
    RegisterExperienceFormDialogComponent
  ],
  providers: [
    UserService,
    RegisterService
  ],
  entryComponents: [
    RegisterPhotoGalleryDialogComponent,
    RegisterVideoGalleryDialogComponent,
    RegisterExperienceFormDialogComponent
  ]
})
export class RegisterModule {

}
