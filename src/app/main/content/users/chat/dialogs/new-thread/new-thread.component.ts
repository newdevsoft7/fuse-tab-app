import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'new-thread-form',
  templateUrl: './new-thread.component.html',
  styleUrls: ['./new-thread.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewThreadFormDialogComponent {
  message: string = '';

  constructor(public dialogRef: MatDialogRef<NewThreadFormDialogComponent>) {}
}
