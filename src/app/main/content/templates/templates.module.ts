import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { TemplatesService } from './templates.service';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { EmailTemplateFormComponent } from './email-templates/template-form/template-form.component';
import { CustomMultiSelectModule } from '../../../core/components/custom-multi-select/custom-multi-select.module';
import { CKEditor5Module } from '../../../core/components/ckeditor/ckeditor.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CustomMultiSelectModule,
    CKEditor5Module
  ],
  declarations: [
    EmailTemplatesComponent,
    EmailTemplateFormComponent
  ],
  exports: [
    EmailTemplatesComponent
  ],
  providers: [
    TemplatesService
  ]
})
export class TemplatesModule { }
