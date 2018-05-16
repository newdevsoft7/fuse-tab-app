import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { ReportsUploadsService } from './reports-uploads.service';
import { ReportsUploadsComponent } from './reports-uploads.component';
import { ReportsUploadsFileListComponent } from './file-list/file-list.component';
import { ReportsUploadsDetailsSidenavComponent } from './sidenavs/details/details.component';
import { ReportsUploadsMainSidenavComponent } from './sidenavs/main/main.component';
import { ReportsSelectShiftDialogComponent } from './select-shift-dialog/select-shift-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ReportsUploadsComponent,
    ReportsUploadsFileListComponent,
    ReportsUploadsDetailsSidenavComponent,
    ReportsUploadsMainSidenavComponent,
    ReportsSelectShiftDialogComponent
  ],
  providers: [
    ReportsUploadsService
  ],
  exports: [
    ReportsUploadsComponent
  ],
  entryComponents: [
    ReportsSelectShiftDialogComponent
  ]
})
export class ReportsUploadsModule { }
