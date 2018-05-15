import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-group-select-shift-dialog',
  templateUrl: './select-shift-dialog.component.html',
  styleUrls: ['./select-shift-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupSelectShiftDialogComponent implements OnInit {

  form: FormGroup;
  group: any = {};
  inputEle: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GroupSelectShiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.group = data.group;
    this.inputEle = data.inputEle;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      shift_id: [null, Validators.required]
    });
  }

  saveForm() {
    if (this.form.valid) {
      const shiftId = this.form.getRawValue().shift_id;
      this.dialogRef.close(shiftId);
      this.inputEle.click();
    }
  }

}
