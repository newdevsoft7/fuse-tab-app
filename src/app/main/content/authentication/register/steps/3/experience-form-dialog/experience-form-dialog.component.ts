import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import * as moment from 'moment';
import * as _ from 'lodash';

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
        this.experience = _.cloneDeep(data.experience || {});
    }

    ngOnInit() {
    }

    saveForm(): void {
      for (let key in this.experience) {
        const id = parseInt(key.replace('h', ''));
        const heading = this.category.headings.find(heading => heading.id === id);
        if (heading && heading.type === 'date') {
          this.experience[key] = moment(this.experience[key]).format('YYYY-MM-DD');
        } else {
          this.experience[key] = `${this.experience[key]}`;
        }
      }
      this.dialogRef.close({
        category: this.category,
        experience: this.experience
      });
    }
}
