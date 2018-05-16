import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as moment from 'moment';
import * as _ from 'lodash';
import { ReportsUploadsService } from '../reports-uploads.service';

@Component({
  selector: 'app-reports-uploads-select-shift-dialog',
  templateUrl: './select-shift-dialog.component.html',
  styleUrls: ['./select-shift-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsSelectShiftDialogComponent implements OnInit {

  form: FormGroup;
  inputEle: any;
  filter: FormControl = new FormControl();
  filteredOptions: any[] = [];
  trackingOptionId: any;

  constructor(
    private formBuilder: FormBuilder,
    private reportsUploadsService: ReportsUploadsService,
    public dialogRef: MatDialogRef<ReportsSelectShiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inputEle = data.inputEle;
    this.trackingOptionId = data.trackingOptionId;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      date: [moment().toDate()]
    });

    this.fetchShifts('');

    this.filter
        .valueChanges
        .map(value => typeof value === 'string' ? value : value.text)
        .debounceTime(300)
        .subscribe(async (val) => {
          this.fetchShifts(val.toLowerCase());
        });
  }

  onDateChanged() {
    this.filter.setValue('');
  }

  async fetchShifts(query) {
    try {
      const date = moment(this.form.getRawValue().date);
      if (date.isValid()) {
        this.filteredOptions =
          await this.reportsUploadsService.getShifts(this.trackingOptionId, date.format('YYYY-MM-DD'), query);
      }
    } catch (e) {
      console.log(e);
    }
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.text : value;
  }

  saveForm() {
    const shiftId = this.filter.value.id;
    if (!_.isNil(shiftId)) {
      this.dialogRef.close(shiftId);
      this.inputEle.click();
    }
  }

}

