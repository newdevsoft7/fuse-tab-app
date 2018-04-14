import { Component, Input, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { MatMenu } from '@angular/material';
import { Moment } from 'moment';

@Component({
  selector: 'sc-calendar-event-chip',
  templateUrl: './event-chip.component.html',
  styleUrls: ['./event-chip.component.scss']
})
export class SCCalendarEventChipComponent implements OnInit {
  @Input('data') event: any;
  @Input() contextMenu: MatMenu;
  @Input() hoverPopup: any;
  @Output() eventShown: EventEmitter<any> = new EventEmitter();
  @Output() onPopupShown: EventEmitter<any> = new EventEmitter();
  @Output() onMenuShown: EventEmitter<any> = new EventEmitter();
  @Output() eventClicked: EventEmitter<any> = new EventEmitter();

  constructor(private $el: ElementRef) {}

  ngOnInit() {
    console.log(this.event);
    this.eventShown.next({
      event: this.event.raw,
      element: this.$el.nativeElement
    });
  }

  getTime(startTime: Moment) {
    const time = startTime.minute() === 0? startTime.format('h') : startTime.format('h:mm');
    const meridiem = startTime.format('a').replace('m', '');
    return `${time}${meridiem}`;
  }

  popupShown() {
    this.onPopupShown.emit(this.event);
  }

  onContextMenuShown() {
    this.onMenuShown.emit(this.event);
  }
}
