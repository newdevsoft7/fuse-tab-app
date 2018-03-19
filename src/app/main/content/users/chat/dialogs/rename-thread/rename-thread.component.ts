import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'rename-thread-form',
  templateUrl: './rename-thread.component.html',
  styleUrls: ['./rename-thread.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RenameThreadFormDialogComponent {
  name: string = '';

  constructor(
    public dialogRef: MatDialogRef<RenameThreadFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    
    this.name = data;
  }
}
