import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { CommonModule } from '@angular/common';
import { SCCalendarComponent } from './sc-calendar.component';
import { 
  SCCalendarMonthViewComponent, 
  SCCalendarEventChipComponent, 
  SCCalendarContextMenuComponent,
  SCCalendarHeaderComponent,
  SCCalendarHoverPopupComponent,
  DayCellDirective, 
  ContextMenuTriggerDirective
} from './views';

import { PopoverModule } from './popover';

@NgModule({
  declarations: [
    SCCalendarComponent,
    SCCalendarMonthViewComponent,
    SCCalendarHeaderComponent,
    SCCalendarEventChipComponent,
    SCCalendarContextMenuComponent,
    SCCalendarHoverPopupComponent,
    DayCellDirective,
    ContextMenuTriggerDirective
  ],
  imports: [
    CommonModule,
    PopoverModule,
    SharedModule
  ],
  providers: [],
  exports: [
    SCCalendarComponent
  ]
})
export class SCCalendarModule { }
