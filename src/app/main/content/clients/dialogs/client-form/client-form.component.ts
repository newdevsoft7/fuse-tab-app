import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'add-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormDialogComponent {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<ClientFormDialogComponent>) {}
}
