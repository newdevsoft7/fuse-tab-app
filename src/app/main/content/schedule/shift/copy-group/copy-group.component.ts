import { Component, Input, OnInit } from '@angular/core';
import { ScheduleService } from '../../schedule.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { Tab } from '../../../../tab/tab';
import { TabService } from '../../../../tab/tab.service';

class ShiftDate {
  from;
  to;

  constructor(date = null, from = null, to = null) {
    this.from = from || { hour: 8, minute: 0, meriden: 'AM', format: 12 };
    this.to = to || { hour: 5, minute: 0, meriden: 'PM', format: 12 };
  }
}

@Component({
  selector: 'app-copy-group',
  templateUrl: './copy-group.component.html',
  styleUrls: ['./copy-group.component.scss']
})
export class CopyGroupComponent implements OnInit {

  @Input() data: any;
  group: any;
  shifts: any[];
  isLoading: boolean;
  groupForm: FormGroup;

  constructor(
    private scheduleService: ScheduleService,
    private scMessageService: SCMessageService,
    private spinner: CustomLoadingService,
    private fb: FormBuilder,
    private tabService: TabService
  ) { }

  ngOnInit() {
    this.fetch();
  }

  async fetch() {
    try {
      this.isLoading = true;
      const { group, shifts } = await this.scheduleService.getShiftGroup(this.data.groupId);
      this.group = group;
      this.shifts = shifts;
      this.groupForm = this.fb.group({
        gname: [group.gname, Validators.required],
        shifts: this.fb.array(
          shifts.map(shift => {
            return this.fb.group({
              id: [shift.id, Validators.required],
              title: [shift.title],
              location: [shift.location],
              contact: [shift.contact],
              address: [shift.address],
              start: [shift.shift_start, Validators.required],
              end: [shift.shift_end, Validators.required],
              // For visualization
              date: [new Date(shift.shift_start.substr(0, 10))],
              from: [translateTime(shift.start)],
              to: [translateTime(shift.end)]
            });
          })
        )
      });
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      this.scMessageService.error(e);
    }
  }

  changeDate(date, event: MatDatepickerInputEvent<Date>) {
    date.value = event.value;
  }

  async onSave() {
    const payload = this.groupForm.getRawValue();
    for (const shift of payload.shifts) {
      const { start, end } = TranslateDateTime(shift.date, shift.from, shift.to);
      shift.start = start;
      shift.end = end;
    }
    try {
      this.spinner.show();
      const { id, gname } = await this.scheduleService.copyGroup(this.group.id, payload);
      this.spinner.hide();
      this.tabService.closeTab(this.data.url);
      const tab = new Tab(
        gname,
        'adminShiftGroupTpl',
        `admin-shift/group/${id}`,
        { id }
      );
      this.tabService.openTab(tab);
    } catch (e) {
      this.spinner.hide();
      this.scMessageService.error(e);
    }
  }

}

function TranslateDateTime(date, from, to) {
  date = moment(date);
  const year = date.year();
  const month = date.month();
  const day = date.date();

  const start = moment({
    year, month, day,
    hour: hours12to24(from.hour, from.meriden),
    minute: from.minute
  }).format('YYYY-MM-DD HH:mm:ss');

  const end = moment({
    year, month, day,
    hour: hours12to24(to.hour, to.meriden),
    minute: to.minute
  }).format('YYYY-MM-DD HH:mm:ss');

  return { start, end };
}

function hours12to24(h, meridiem) {
  return h === 12 ? (meridiem.toUpperCase() === 'PM' ? 12 : 0) : (meridiem.toUpperCase() === 'PM' ? h + 12 : h);
}

function translateTime(time: string) {
  if (!time) { return; }
  const [hm, meriden] = time.split(' ');
  const [hour, minute] = hm.split(':');
  return { hour: +hour, minute: +minute, meriden: meriden.toUpperCase(), format: 12 };
}

