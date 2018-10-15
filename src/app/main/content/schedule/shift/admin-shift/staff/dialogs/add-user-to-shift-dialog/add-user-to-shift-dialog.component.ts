import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-user-to-shift-dialog',
  templateUrl: './add-user-to-shift-dialog.component.html',
  styleUrls: ['./add-user-to-shift-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserToShiftDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUserToShiftDialogComponent>
  ) { }

  ngOnInit() {
  }

  doAction(role, action) {
    const role = this.data.shift.shift_roles.find(r => r.id == role.id);
    this.dialogRef.close({ role, action });
  }

}
