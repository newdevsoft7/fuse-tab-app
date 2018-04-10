import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { TemplatesService } from './templates.service';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    EmailTemplatesComponent
  ],
  exports: [
    EmailTemplatesComponent
  ],
  providers: [
    TemplatesService
  ]
})
export class TemplatesModule { }
