import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Moment } from 'moment';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { EventOptionEntity, EventEntity, ContextMenuItemEntity, CONTEXT_MENU_TRIGGER_MODE } from '../../../../core/components/sc-calendar';
import { ScheduleService } from '../schedule.service';
import { Tab } from '../../../tab/tab';
import { TabService } from '../../../tab/tab.service';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { ActionService } from '../../../../shared/services/action.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit {

  dialogRef: MatDialogRef<CalendarEventFormDialogComponent>;

  currentUser: any;

  filtersObservable: any;
  filters: any;

  startDate: string;
  endDate: string;

  loading: boolean = false;

  options: EventOptionEntity = {
    dayRender: (date: Moment, cell: Element): void => {
      // put some logic here for styling the day cells
    },
    eventRender: (event: EventEntity, element: Element): void => {
      // put some logic here for styling event chips
    },
    dayClick: (date: Moment, jsEvent: Event): void => {
      if (!['owner', 'admin'].includes(this.currentUser.lvl)) { return; }
      const url = `schedule/new-shift/${date.toString()}`;
      const tab = new Tab('New Shift', 'newShiftTpl', url, { date, url });
      this.tabService.openTab(tab);
    },
    eventClick: (event: EventEntity, jsEvent: Event): void => {
      this.openEventTab(event);
    }
  };

  contextMenu: { mode: number, data: ContextMenuItemEntity[] } = {
    mode: CONTEXT_MENU_TRIGGER_MODE.ELLIPSIS,
    data: [
      {
        title: 'Open',
        icon: 'open_in_new',
        callback: (event: EventEntity): void => {
          this.openEventTab(event);
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
          this.openEditShiftTab(event);
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
    ]
  };

  constructor(
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private scheduleService: ScheduleService,
    private tokenStorage: TokenStorage,
    private actionService: ActionService,
    private tabService: TabService) { }


  ngOnInit() {
    this.currentUser = this.tokenStorage.getUser();
    this.filtersObservable = (text: string): Observable<any> => {
      return Observable.of([]);
    };
  }

  onFiltersChanged(filters: any) {
    this.filters = filters;
    this.fetchEvents();
  }

  updateEvents(event: { startDate: string, endDate: string }) {
    this.filtersObservable = (text: string): Observable<any> => {
      return this.scheduleService.getShiftFilters(event.startDate, event.endDate, text);
    };
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.fetchEvents();
  }

  async fetchEvents() {
    const query = {
      filters: this.filters,
      from: this.startDate,
      to: this.endDate,
      view: 'calendar'
    };

    this.loading = true;

    try {
      this.options.events = await this.scheduleService.getShifts(query).toPromise();
    } catch (e) {
      this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong while fetching events.');
    }

    this.loading = false;
  }

  triggerEventModal(data: { action: string, date?: Moment, event?: EventEntity }): void {
    this.dialogRef = this.dialog.open(CalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data
    });
    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
      const temp = response.getRawValue();
      const newEvent = new EventEntity();
      newEvent.title = temp.title;
      if (temp.start.time) {
        newEvent.start = `${moment(temp.start.date).format('YYYY-MM-DD')} ${temp.start.time}`;
      } else {
        newEvent.start = `${moment(temp.start.date).format('YYYY-MM-DD')}`;
      }
      if (temp.end.date && moment(temp.end.date).isValid()) {
        if (temp.end.time) {
          newEvent.end = `${moment(temp.end.date).format('YYYY-MM-DD')} ${temp.end.time || ''}`;
        } else {
          newEvent.end = `${moment(temp.end.date).format('YYYY-MM-DD')}`;
        }
      }
      if (temp.backgroundColor) {
        newEvent.eventBackgroundColor = temp.backgroundColor;
      }
      if (data.action === 'new') {
        if (!this.options.events) {
          this.options.events = [];
        }
        this.options.events.push(newEvent);
      } else {
        const index = this.options.events.indexOf(data.event);
        if (index > -1) {
          this.options.events[index] = { ...data.event, ...newEvent };
        }
      }
    });
  }

  openEventTab(event: EventEntity) {
    const id = event.id;
    let template = 'staffShiftTpl';
    let url = `staff/shift/${id}`;

    if (['owner', 'admin'].includes(this.currentUser.lvl)) {
      template = 'adminShiftTpl';
      url = `admin/shift/${id}`;
    }
    const tab = new Tab(event.title, template, url, { id, url });
    this.tabService.openTab(tab);
  }

  // Open Shifts edit tab for a shift
  async openEditShiftTab(event: EventEntity) {
    if (!['owner', 'admin'].includes(this.currentUser.lvl)) { return; }
    try {
      const shift = await this.scheduleService.getShift(event.id);
      const shifts = [shift];
      const tab = new Tab('Shifts Edit', 'editShiftTpl', 'admin/shift/edit', { shifts });
      this.tabService.openTab(tab);
      this.actionService.addShiftsToEdit(shifts);
    } catch (e) {
      this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong while fetching events.');
    }
  }
}
