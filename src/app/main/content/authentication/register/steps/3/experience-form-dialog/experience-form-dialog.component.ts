import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-register-experience-form-dialog',
    templateUrl: './experience-form-dialog.component.html',
    styleUrls: ['./experience-form-dialog.component.scss']
})
export class RegisterExperienceFormDialogComponent implements OnInit {

    category: any;
    experience: any;

    constructor(
        public dialogRef: MatDialogRef<RegisterExperienceFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.category = data.category;
        this.experience = data.experience || {};
    }

    ngOnInit() {
    }

    saveForm() {
      this.dialogRef.close({
        category: this.category,
        experience: this.experience
      });
    }
}
