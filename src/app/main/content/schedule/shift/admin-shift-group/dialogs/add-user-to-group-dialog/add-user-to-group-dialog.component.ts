import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-user-to-group-dialog',
  templateUrl: './add-user-to-group-dialog.component.html',
  styleUrls: ['./add-user-to-group-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserToGroupDialogComponent implements OnInit {

  roles: string[] = [];
  selectedRole: string;

  constructor(
    public dialogRef: MatDialogRef<AddUserToGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    for (const shift of this.data.shifts) {
      for (const role of shift.roles) {
        if (!this.roles.find(r => r.toLowerCase() == role.rname.toLowerCase())) {
          this.roles.push(role.rname);
        }
      }
    }
    this.selectedRole = this.roles[0];
  }

  doAction(shift, role, action) {
    this.dialogRef.close({ shiftId: shift.id, roleId: role.id, action });
  }

  doToAllShifts(roleName, action) {
    this.dialogRef.close({ roleName, action });
  }

}
