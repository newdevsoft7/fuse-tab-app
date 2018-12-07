import { Component, OnInit, Input } from "@angular/core";
import { UserService } from "@app/main/content/users/user.service";
import { EventOptionEntity, EventEntity, ContextMenuItemEntity } from "@app/core/components/sc-calendar";
import { Moment } from "moment";
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MatDialog } from "@angular/material";
import { UsersProfileCalendarEventFormDialogComponent } from "@app/main/content/users/profile/calendar/event-form/event-form.component";
import { FuseConfirmDialogComponent } from "@app/core/components/confirm-dialog/confirm-dialog.component";
import { FilterService } from "@shared/services/filter.service";
import { Tab } from "@app/main/tab/tab";
import { TabService } from "@app/main/tab/tab.service";

@Component({
  selector: 'app-users-profile-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class UsersProfileCalendarComponent implements OnInit {

  @Input() userInfo: any;
  @Input() currentUser: any;
  @Input() settings: any;

  options: EventOptionEntity = {
    dayRender: (date: Moment, cell: Element): void => {
      // put some logic here for styling the day cells
    },
    eventRender: (event: EventEntity, element: Element): void => {
      // put some logic here for styling event chips
    },
    eventClick: (event: EventEntity, jsEvent: Event): void => {
      if (event.type === 'u') {
        this.triggerEventModal(event);
      } else {
        this.openEventTab(event);
      }
    }
  };

  contextMenu: { mode?: number, data?: ContextMenuItemEntity[], disabled?: boolean } = {
    data: [],
    disabled: true
  };

  startWeekDay: number;
  loading: boolean = false;
  dialogRef: MatDialogRef<UsersProfileCalendarEventFormDialogComponent>;

  constructor(
    private tabService: TabService,
    private filterService: FilterService,
    private toastrService: ToastrService,
    private userService: UserService,
    private dialog: MatDialog) {}

  ngOnInit() {
    const calendarStartDay = this.settings.calendar_start_day;
    this.startWeekDay = calendarStartDay !== undefined ? +calendarStartDay : 0;
    if (this.startWeekDay === 1) {
      this.options.dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      this.options.dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  }

  async updateShifts(event: { startDate: string, endDate: string }) {
    this.showLoading();

    try {
      this.options.events = await this.userService.getStaffCalendarShifts(this.userInfo.id, event.startDate, event.endDate);
    } catch (e) {
      this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong while fetching events.');
    }

    this.hideLoading();
  }

  showLoading() {
    setTimeout(() => this.loading = true);
  }

  hideLoading() {
    setTimeout(() => this.loading = false);
  }

  triggerEventModal(data: EventEntity): void {
    this.dialogRef = this.dialog.open(UsersProfileCalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data
    });
    this.dialogRef.afterClosed().subscribe(async (response: any) => {
      if (!response) {
        return;
      }
      if (response.type === 'delete') {
        this.showLoading();
        try {
          await this.userService.deleteUnavailableShift(response.id);
          let event = this.options.events.find((event) => event.id === response.id && event.type === 'u');
          if (event) {
            this.deleteEvent(event);
          }
        } catch (e) {
          this.toastrService.error((e.error && e.error.message)? e.error.message : 'Something is wrong while deleting shift.');
        }
        this.hideLoading();
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
            await this.userService.deleteShift(event.id);
            this.filterService.clean(this.filterService.type.shifts);
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
            await this.userService.deleteGroup(event.id); 
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
    if (event.type !== 'g') {
      const id = event.id;
      let url = `staff/shift/${id}`;
      const tab = new Tab(event.title, 'staffShiftTpl', url, { id, url });
      this.tabService.openTab(tab);
    }
  }
}
