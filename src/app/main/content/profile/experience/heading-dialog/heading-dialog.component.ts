import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ProfileExperienceService } from '../experience.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-profile-experience-heading-dialog',
    templateUrl: './heading-dialog.component.html',
    styleUrls: ['./heading-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExperienceHeadingDialogComponent implements OnInit {

    types = [
        { label: 'Text', value: 'text' },
        { label: 'Choose from list', value: 'list' },
        { label: 'Number', value: 'number' },
        { label: 'Date', value: 'date' }
    ];

    heading: any; // For editing heading

    constructor(
        private toastr: ToastrService,
        private experienceService: ProfileExperienceService,
        public dialogRef: MatDialogRef<ExperienceHeadingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.heading = _.cloneDeep(data.heading || { options: [] });
        if (this.heading.options.length === 0) { this.heading.options.push({}); }
    }

    ngOnInit() {
    }

    addOption() {
        this.heading.options.push({});
    }

    removeOption(index) {
        const options = this.heading.options.splice(index, 1);
    }

    onTypeChange() {
        if (this.heading.type === 'list') {
            if (this.heading.options.length === 0) {
                this.heading.options.push({});
            }
        }
    }

    save() {
        if (!this.heading.hname || !this.heading.type) { return; }
            this.dialogRef.close(this.heading);
    }

}
