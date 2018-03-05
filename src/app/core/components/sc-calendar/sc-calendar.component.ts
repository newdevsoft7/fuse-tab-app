import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation, DoCheck } from '@angular/core';
import { EventOptionEntity, ContextMenuItemEntity } from './entities';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'sc-calendar',
  templateUrl: './sc-calendar.component.html',
  styleUrls: ['./sc-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SCCalendarComponent implements OnInit, DoCheck {
  @Input() options: EventOptionEntity;
  @Input() contextMenu: ContextMenuItemEntity[] = [];
  @Input() ajax: Boolean = false;
  @Output() optionChanged: EventEmitter<{startDate: string, endDate: string}> = new EventEmitter();
  eventOptions: EventOptionEntity = new EventOptionEntity();

  oldOptions: EventOptionEntity;
  dateRange: any;

  constructor() {}

  ngOnInit() {
    this.oldOptions = _.cloneDeep(this.options);

    this.eventOptions = {
      ...this.eventOptions,
      ...this.options
    };

    if (this.ajax) {
      setTimeout(() => this.loadAjaxEvents());
    }
  }

  ngDoCheck() {
    if (JSON.stringify(this.options) !== JSON.stringify(this.oldOptions)) {
      this.oldOptions = _.cloneDeep(this.options);
      this.eventOptions = {
        ...this.eventOptions,
        ...this.options
      };
    }
  }

  get title(): string {
    return moment(this.eventOptions.defaultDate).format(this.eventOptions.titleFormat);
  }

  get month(): string {
    return moment(this.eventOptions.defaultDate).format('MMM');
  }

  dateChanged(when): void {
    switch (when) {
      case 'prev':
        this.options.defaultDate = moment(this.eventOptions.defaultDate).subtract(1, <any>this.eventOptions.defaultView).format('YYYY-MM-DD');
        break;
      case 'next':
        this.options.defaultDate = moment(this.eventOptions.defaultDate).add(1, <any>this.eventOptions.defaultView).format('YYYY-MM-DD');
        break;
    }
    if (this.ajax) {
      setTimeout(() => this.loadAjaxEvents());
    }
  }

  updateMonthRange(dateRange: any) {
    this.dateRange = dateRange;
  }

  loadAjaxEvents() {
    this.optionChanged.next(this.dateRange);
  }
}
