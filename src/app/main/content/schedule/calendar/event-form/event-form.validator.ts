import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export const ValidateStartDatetime = (control: AbstractControl) => {

  if (!control.parent || !control) {
    return;
  }

  const start = `${moment(control.parent.get('date').value).format('YYYY-MM-DD')} ${control.parent.get('time').value}`;
  const end = `${moment(control.parent.parent.get(['end', 'date']).value).format('YYYY-MM-DD')} ${control.parent.parent.get(['end', 'time']).value}`;

  if (moment(start).isAfter(end)) {
    return {
      earlierThanEndDate: true
    };
  }
};

export const ValidateEndDatetime = (control: AbstractControl) => {

  if (!control.parent || !control) {
    return;
  }

  const end = `${moment(control.parent.get('date').value).format('YYYY-MM-DD')} ${control.parent.get('time').value}`;
  const start = `${moment(control.parent.parent.get(['start', 'date']).value).format('YYYY-MM-DD')} ${control.parent.parent.get(['start', 'time']).value}`;

  if (moment(end).isBefore(start)) {
    return {
      laterThanStartDate: true
    };
  }
};

export const ValidateTimeFormat = (control: AbstractControl) => {

  if (!control.parent || !control) {
    return;
  }

  const time = control.parent.get('time');

  if (!time || !time.value) {
    return;
  }

  if (!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time.value)) {
    return {
      validTimeFormat: true
    };
  }
};
