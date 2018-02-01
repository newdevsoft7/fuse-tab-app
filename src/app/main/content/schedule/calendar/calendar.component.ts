import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { EventOptionEntity, EventEntity, ContextMenuItemEntity } from '../../../../core/components/sc-calendar';
import { FormGroup } from '@angular/forms/src/model';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit {

  dialogRef: MatDialogRef<CalendarEventFormDialogComponent>;

  options: EventOptionEntity = {
    dayRender: (date: Moment, cell: Element): void => {
      // put some logic here for styling the day cells
    },
    eventRender: (event: EventEntity, element: Element): void => {
      // put some logic here for styling event chips
    },
    dayClick: (date: Moment, jsEvent: Event): void => {
      this.addNewEvent(date);
    },
    eventClick: (event: EventEntity, jsEvent: Event): void => {
      // put some logic here for editing event
    },
    events: [
      {
        title: 'All Day Event',
        start: '2018-02-05T16:00:00'
      },
      {
        title: 'Long Event',
        start: '2018-02-07',
        end: '2018-02-10',
        backgroundColor: '#ff4081',
        icon: 'warning'
      }
    ]
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

  constructor(
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  addNewEvent(date: Moment): void {
    this.dialogRef = this.dialog.open(CalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data: {
        action: 'new',
        date
      }
    });
    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
      const temp = response.getRawValue();
      const newEvent = new EventEntity();
      newEvent.title = temp.title;
      newEvent.start = `${moment(temp.start.date).format('YYYY-MM-DD')} ${temp.start.time}`;
      if (temp.end) {
        newEvent.end = `${moment(temp.end.date).format('YYYY-MM-DD')} ${temp.end.time}`;
      }
      if (temp.backgroundColor) {
        newEvent.backgroundColor = temp.backgroundColor;
      }
      if (!this.options.events) {
        this.options.events = [];
      }
      this.options.events.push(newEvent);
    });
  }
}
