import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { TabComponent } from '../../../tab/tab/tab.component';
import { Subscription } from 'rxjs';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { SettingsService } from '../../settings/settings.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<CalendarEventFormDialogComponent>;

  currentUser: any;

  filtersObservable: any;
  filters: any;
  tmpFilters: any;
  startDate: string;
  endDate: string;
  
  currentUserFlags: any;
  isSingle: boolean = false;
  selectedFlags: any;

  loading: boolean = false;

  tabLoaded: boolean = false;
  tabActiveSubscription: Subscription;

  hoverAsyncFn: any;

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
      if (event.type === 'u') {
        this.triggerEventModal(event);
      } else {
        this.openEventTab(event);
      }
    }
  };

  contextMenu: { mode: number, data: ContextMenuItemEntity[] } = {
    mode: CONTEXT_MENU_TRIGGER_MODE.ELLIPSIS,
    data: [
      {
        title: 'Open',
        icon: 'open_in_new',
        callback: (event: EventEntity): void => {
          if (event.type === 'u') {
            this.triggerEventModal(event);
          } else {
            this.openEventTab(event);
          }
        }
      },
      {
        title: 'Copy',
        icon: 'content_copy',
        callback: (event: EventEntity): void => {
          if (event.type === 'u') {
            // For unavailabilities
          } else if (event.type === 'g') {
            // For group shift
          } else {
            const url = `schedule/new-shift/${event.id}`;
            const tab = new Tab('New Shift', 'newShiftTpl', url, { url, shiftId: event.id });
            this.tabService.openTab(tab);
          }
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
          this.deleteEvent(event);
        }
      }
    ]
  };

  isLegendShow = false;
  shiftStatuses: any[] = [];

  constructor(
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private scheduleService: ScheduleService,
    private tokenStorage: TokenStorage,
    private actionService: ActionService,
    private tabService: TabService,
    private scMessageService: SCMessageService,
    private settingsService: SettingsService) { }


  ngOnInit() {
    this.currentUser = this.tokenStorage.getUser();

    this.hoverAsyncFn = (shiftId: number, group?: boolean) => this.scheduleService.getPopupContent(shiftId, group);

    if (['owner', 'admin'].includes(this.currentUser.lvl)) {
      this.currentUserFlags = this.tokenStorage.getSettings().flags;
      for (let flag of this.currentUserFlags) {
        flag.set = 2;
      }
    }
    this.filtersObservable = (text: string): Observable<any> => {
      return Observable.of([]);
    };

    this.tabActiveSubscription = this.tabService.tabActived.subscribe((tab: TabComponent) => {
      if (tab.url === 'schedule/calendar') {
        if (this.tabLoaded) {
          this.fetchEvents(false);
        } else {
          this.tabLoaded = true;
        }
      }
    });
  }

  ngOnDestroy() {
    this.tabActiveSubscription.unsubscribe();
    this.tabLoaded = false;
  }

  onFiltersChanged(filters: any) {
    this.tmpFilters = this.filters = filters.map(v => v.id); 
    this.filters = (this.selectedFlags) ? this.filters.concat(this.selectedFlags) : this.filters ;
    this.fetchEvents(true);
  }

  updateEvents(event: { startDate: string, endDate: string }) {
    this.filtersObservable = (text: string): Observable<any> => {
      return this.scheduleService.getShiftFilters(event.startDate, event.endDate, text);
    };
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.fetchEvents(true);
  }

  async fetchEvents(isLoading: boolean) {
    const query = {
      filters: this.filters,
      from: this.startDate,
      to: this.endDate,
      view: 'calendar'
    };

    if (isLoading) this.loading = true;

    try {
      this.options.events = await this.scheduleService.getShifts(query).toPromise();
    } catch (e) {
      this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong while fetching events.');
    }

    this.loading = false;
  }

  triggerEventModal(data: EventEntity): void {
    this.dialogRef = this.dialog.open(CalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data
    });
    this.dialogRef.afterClosed().subscribe(async (response: any) => {
      if (!response) {
        return;
      }
      if (response.type === 'delete') {
        this.loading = true;
        try {
          await this.scheduleService.deleteUnavailableShift(response.id);
          let event = this.options.events.find((event) => event.id === response.id && event.type === 'u');
          if (event) {
            this.deleteEvent(event);
          }
        } catch (e) {
          this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong while deleting shift.');
        }
        this.loading = false;
      }
    });
  }

  deleteEvent(event: EventEntity): void {
    if (event.type !== 'g') {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      dialogRef.componentInstance.confirmMessage = 'Are you sure?';
      dialogRef.afterClosed().subscribe(async(result) => {
        if (result) {
          try {
            const index = this.options.events.indexOf(event);
            if (index > -1) {
              this.options.events.splice(index, 1);
            }
            await this.scheduleService.deleteShift(event.id);
            // this.toastrService.success(res.message);
          } catch (e) {
            this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong.');
          }
        }
      });
    } else if (event.type === 'g') {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      dialogRef.componentInstance.confirmMessage = 'Are you sure?';
      dialogRef.afterClosed().subscribe(async(result) => {
        if (result) {
          try {
            const index = this.options.events.indexOf(event);
            if (index > -1) {
              this.options.events.splice(index, 1);
            }
            await this.scheduleService.deleteGroup(event.id); 
          } catch (e) {
            this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong.');
          }
        }
      });
    } else {
      const index = this.options.events.indexOf(event);
      if (index > -1) {
        this.options.events.splice(index, 1);
      }
    }
  }

  openEventTab(event: EventEntity) {
    if (event.type === 'g') {
      if (['owner', 'admin'].includes(this.currentUser.lvl)) {
        const tab = new Tab(
          event.title,
          'adminShiftGroupTpl',
          `admin-shift/group/${event.id}`,
          { id: event.id }
        );
        this.tabService.openTab(tab);
      } else {
        return;
      }
    } else {
      const id = event.id;
      let template: string;
      let url: string;
  
      switch (this.currentUser.lvl) {
        case 'owner':
        case 'admin':
        case 'client':
          template = 'adminShiftTpl';
          url = `admin/shift/${id}`;
          break;
        case 'staff':
          template = 'staffShiftTpl';
          url = `staff/shift/${id}`;
          break;
      }
      const tab = new Tab(event.title, template, url, { id, url });
      this.tabService.openTab(tab);
    }
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

  // Toggles Flag and Filters the Calendar Values
  toggleFlagClick(flag) {
    this.isSingle = true;
    if (flag.set === 0 ) { return; }
    setTimeout(() => {
      if (this.isSingle === true){
        flag.set = flag.set === 1 ? 2 : 1;
        this.updateFlagFilters();
      }
    }, 250);
  }
  toggleFlagDblClick(flag) {
    this.isSingle = false;
    flag.set = flag.set === 0 ? 2 : 0;
    this.updateFlagFilters();
  }

  // Updates the selected flags and concats them into the main filters variable
  updateFlagFilters() {
    this.selectedFlags = [];
    for (let flag of this.currentUserFlags) {
      if (flag.set !== 2) {
        this.selectedFlags.push(`flag:${flag.id}:${flag.set}`);
      }
    }
    if (this.tmpFilters) {
      this.filters = [];
      this.filters = this.tmpFilters;
      this.filters = this.filters.concat(this.selectedFlags);
    } else {
      this.filters = this.selectedFlags;
    }

    this.fetchEvents(true);
  }

  async showLegend() {
    this.isLegendShow = true;
    try {
      if (this.currentUser.lvl == 'admin' || this.currentUser.lvl == 'owner') {
        this.shiftStatuses = await this.settingsService.getShiftStatuses();
      } else {
        // TODO - get shift status
      }
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

}
