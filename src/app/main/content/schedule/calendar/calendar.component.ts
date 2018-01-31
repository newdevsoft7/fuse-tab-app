import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Moment } from 'moment';
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
    defaultDate: '2017-12-12',
    dayRender: (date: Moment, cell: Element): void => {
      // put some logic here for styling the day cells
    },
    eventRender: (event: EventEntity, element: Element): void => {
      // put some logic here for styling event chips
    },
    events: [
      {
        title: 'All Day Event',
        start: '2017-12-01'
      },
      {
        title: 'Long Event',
        start: '2017-12-07',
        end: '2017-12-10',
        backgroundColor: '#ff4081',
        icon: 'warning'
      },
      {
        title: 'Repeating Event',
        start: '2017-12-09T16:00:00'
      },
      {
        title: 'Repeating Event',
        start: '2017-12-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2017-12-11',
        end: '2017-12-13'
      },
      {
        title: 'Meeting',
        start: '2017-12-12T10:30:00',
        end: '2017-12-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2017-12-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2017-12-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2017-12-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2017-12-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2017-12-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2017-12-28'
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

  cellClicked(date: Moment): void {
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
      const newEvent = response.getRawValue();
      console.log('============', newEvent);
    });
  }
}
