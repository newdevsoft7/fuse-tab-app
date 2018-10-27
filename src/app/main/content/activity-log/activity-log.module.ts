import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { LaddaModule } from 'angular2-ladda';

import { ActivityLogService } from './activity-log.service';
import { ActivityLogComponent } from './activity-log/activity-log.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LaddaModule.forRoot({
      style: 'expand-right',
      spinnerColor: 'blue'
    })
  ],
  declarations: [
    ActivityLogComponent
  ],
  providers: [
    ActivityLogService
  ],
  exports: [
    ActivityLogComponent
  ]
})
export class ActivityLogModule { }
