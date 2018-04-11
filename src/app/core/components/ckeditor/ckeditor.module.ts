import { NgModule } from "@angular/core";
import { CKEditor5Component } from "./ckeditor.component";
import { SharedModule } from "../../modules/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CKEditor5Component
  ],
  exports: [
    CKEditor5Component
  ]
})
export class CKEditor5Module {}
