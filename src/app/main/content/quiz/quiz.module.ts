import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { QuizComponent } from './quiz.component';
import { QuizService } from './quiz.service';

@NgModule({
  imports         : [
    CommonModule,
    SharedModule
  ],
  declarations    : [
    QuizComponent
  ],
  providers: [ QuizService ],
  exports         : [
    QuizComponent
  ],
  entryComponents : [
  ]

})
export class QuizModule { }
