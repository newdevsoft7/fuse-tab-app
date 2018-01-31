import { Component, OnInit } from '@angular/core';
import { EventOptionEntity, EventEntity, ContextMenuItemEntity } from '../../../../core/components/sc-calendar';
import { Moment } from 'moment';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit {

  options: EventOptionEntity = {
    defaultDate: '2017-12-12',
    dayRender: (date: Moment, cell: Element): void => {
      // put some logic here for styling the day cells
    },
    eventRender: (event: EventEntity, element: Element): void => {
      // put some logic here for styling event chips
    }
  };

  contextMenu: ContextMenuItemEntity[] = [
    {
      title: 'Open',
      icon: 'open_in_new',
      callback: (event: EventEntity): void => {
        // put some logic here
      }
    },
    {
      title: 'Copy',
      icon: 'content_copy',
      callback: (event: EventEntity): void => {
        // put some logic here
      }
    },
    {
      title: 'Edit',
      icon: 'mode_edit',
      callback: (event: EventEntity): void => {
        // put some logic here
      }
    },
    {
      title: 'Status',
      icon: 'mode_edit',
      children: [
        {
          title: 'Default',
          callback: (event: EventEntity): void => {
            // put some logic here
          }
        },
        {
          title: 'Completed',
          callback: (event: EventEntity): void => {
            // put some logic here
          }
        },
        {
          title: 'Invoiced',
          callback: (event: EventEntity): void => {
            // put some logic here
          }
        },
        {
          title: 'Paid',
          callback: (event: EventEntity): void => {
            // put some logic here
          }
        },
        {
          title: 'Cancelled',
          callback: (event: EventEntity): void => {
            // put some logic here
          }
        }
      ]
    },
    {
      title: 'Delete',
      icon: 'delete',
      callback: (event: EventEntity): void => {
        const index = this.options.events.indexOf(event);
        if (index > -1) {
          this.options.events.splice(index, 1);
        }
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
