import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-outsource-company-form',
  templateUrl: './outsource-company-form.component.html',
  styleUrls: ['./outsource-company-form.component.scss']
})
export class OutsourceCompanyFormComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<OutsourceCompanyFormComponent>) {}
}
