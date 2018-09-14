import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-staff-shift-reports-uploads',
    templateUrl: './reports-uploads.component.html',
    styleUrls: ['./reports-uploads.component.scss']
})
export class StaffShiftReportsUploadsComponent implements OnInit {

    @Input() shift;
    data: any = {};

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private spinner: CustomLoadingService,
        private scMessageService: SCMessageService
    ) {
    }

    ngOnInit() {
        this.fetch();
    }

    async fetch() {
        try {
            this.data = await this.scheduleService.getShiftReportsUploads(this.shift.id);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async onUpload(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
			this.spinner.show();

			let formData = new FormData();

			for (let i = 0; i < files.length; i++) {
				formData.append('file[]', files[i], files[i].name);
			}

            formData.append('folder', 'shift');
            formData.append('id', this.shift.id);

			try {
                const res = await this.scheduleService.reportsUploads(formData);
                this.spinner.hide();
                //this.toastr.success(res.message);
                this.data.files.push(...res.data);
            } catch (e) {
                this.spinner.hide();
                _.forEach(e.error.errors, errors => {
                    _.forEach(errors, (error: string) => {
                        const message = _.replace(error, /file\.\d+/g, 'file');
                        this.toastr.error(message);
                    });
                });

            }
		}
    }

    deleteFile(file) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) { return; }
            try {
                const index = this.data.files.findIndex(f => f.id === file.id);
                this.data.files.splice(index, 1);
                //this.toastr.success(res.message);
            } catch (e) {
                this.toastr.error(e.message);
            }
        });
    }

    deleteReport(report) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) { return; }
            try {
                const index = this.data.surveys.findIndex(s => s.id === report.id);
                this.data.surveys.splice(index, 1);
                //this.toastr.success(res.message);
            } catch (e) {
                // To be removed
                const index = this.data.surveys.findIndex(s => s.id === report.id);
                this.data.surveys.splice(index, 1);
            }
        });
    }

}
