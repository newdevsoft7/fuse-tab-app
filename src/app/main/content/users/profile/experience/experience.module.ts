import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../../core/modules/shared.module";
import { UsersProfileExperienceComponent } from "./experience.component";
import { UsersProfileExperienceService } from "./experience.service";
import { UsersProfileExperienceFormDialogComponent } from "./experience-form-dialog/experience-form-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    UsersProfileExperienceComponent,
    UsersProfileExperienceFormDialogComponent
  ],
  exports: [
    UsersProfileExperienceComponent,
    UsersProfileExperienceFormDialogComponent
  ],
  entryComponents: [
    UsersProfileExperienceFormDialogComponent
  ],
  providers: [
    UsersProfileExperienceService
  ]
})
export class UsersProfileExperienceModule {

}
