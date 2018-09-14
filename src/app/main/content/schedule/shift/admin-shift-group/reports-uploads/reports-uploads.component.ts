import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { GroupSelectShiftDialogComponent } from './select-shift-dialog/select-shift-dialog.component';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-group-reports-uploads',
    templateUrl: './reports-uploads.component.html',
    styleUrls: ['./reports-uploads.component.scss']
})
export class GroupReportsUploadsComponent implements OnInit {

    @Input() shifts;
    @Input() group;
    @ViewChild('fileInput') fileInput: ElementRef;

    data: any = {};
    shiftId: any;

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
            this.data = await this.scheduleService.getGroupReportsUploads(this.group.id);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    openShiftDialog() {
        const dialogRef = this.dialog.open(GroupSelectShiftDialogComponent, {
            disableClose: false,
            panelClass: 'group-select-shift-dialog',
            data: {
                group: this.group,
                inputEle: this.fileInput.nativeElement
            }
        });
        dialogRef.afterClosed().subscribe(id => {
            if (id !== false) {
                this.shiftId = id;
            }
        });
    }

    async onUpload(event) {
        if (!this.shiftId) { return; }
        const files = event.target.files;
        if (files && files.length > 0) {
            this.spinner.show();

            let formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('file[]', files[i], files[i].name);
            }

            formData.append('folder', 'shift');
            formData.append('id', this.shiftId);

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

    async approve(file, type) {
        const value = file.approved ? 0 : 1;
        try {
            file.approved = value;
            //this.toastr.success(res.message);
        } catch (e) {
            this.scMessageService.error(e);
            file.approved = value ? 0 : 1;
        }
    }

}
