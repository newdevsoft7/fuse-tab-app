import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { ShowcaseComponent } from './showcase.component';
import { ShowcaseService } from './showcase.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ShowcaseComponent
  ],
  providers: [
    ShowcaseService
  ],
  exports: [
    ShowcaseComponent
  ]
})
export class ShowcaseModule { }
