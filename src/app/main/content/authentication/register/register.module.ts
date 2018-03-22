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

import {
  // Profile Step
  RegisterProfileEditDateComponent,
  RegisterProfileEditListValueComponent,
  RegisterProfileEditSexComponent,
  RegisterProfileEditTextValueComponent,
  RegisterProfileEditListmValueComponent,
  // Photo Step
  RegisterPhotoGalleryDialogComponent
} from "./steps";
import { RegisterRoutingModule } from "./register-routing.module";
import { UserService } from "../../users/user.service";
import { RegisterService } from "./register.service";
import { RegisterVideoGalleryDialogComponent } from "./steps/5/video-gallery-dialog/video-gallery-dialog.component";

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
    RegisterVideoGalleryDialogComponent
  ],
  providers: [
    UserService,
    RegisterService
  ],
  entryComponents: [
    RegisterPhotoGalleryDialogComponent
  ]
})
export class RegisterModule {

}
