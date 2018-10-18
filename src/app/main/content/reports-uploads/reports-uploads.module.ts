import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { ReportsUploadsService } from './reports-uploads.service';
import { ReportsUploadsComponent } from './reports-uploads.component';
import { ReportsUploadsFileListComponent } from './file-list/file-list.component';
import { ReportsUploadsDetailsSidenavComponent } from './sidenavs/details/details.component';
import { ReportsSelectShiftDialogComponent } from './select-shift-dialog/select-shift-dialog.component';
import { QuizsComponent } from './quizs/quizs.component';
import { SurveysComponent } from './surveys/surveys.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ReportsUploadsComponent,
    ReportsUploadsFileListComponent,
    ReportsUploadsDetailsSidenavComponent,
    ReportsSelectShiftDialogComponent,
    QuizsComponent,
    SurveysComponent
  ],
  providers: [
    ReportsUploadsService
  ],
  exports: [
    ReportsUploadsComponent,
    QuizsComponent,
    SurveysComponent
  ],
  entryComponents: [
    ReportsSelectShiftDialogComponent
  ]
})
export class ReportsUploadsModule { }
