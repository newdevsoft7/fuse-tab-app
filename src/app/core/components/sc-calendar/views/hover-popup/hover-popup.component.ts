import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventEntity } from '../../entities';

@Component({
  selector: 'sc-calendar-hover-popup',
  templateUrl: './hover-popup.component.html',
  styleUrls: ['./hover-popup.component.scss']
})
export class SCCalendarHoverPopupComponent {
  @Input() data: any;
  @Output() staffClicked: EventEmitter<any> = new EventEmitter();

  onStaffClick(staff) {
    this.staffClicked.emit(staff);
  }
}
