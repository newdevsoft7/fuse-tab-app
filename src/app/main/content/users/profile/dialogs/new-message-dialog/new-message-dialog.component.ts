import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-message-dialog',
  templateUrl: './new-message-dialog.component.html',
  styleUrls: ['./new-message-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewMessageDialogComponent implements OnInit {

  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<NewMessageDialogComponent>
  ) { }

  ngOnInit() {
  }

}
