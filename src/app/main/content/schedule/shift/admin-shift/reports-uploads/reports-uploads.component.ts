import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Tab } from '../../../../../tab/tab';
import { TabService } from '../../../../../tab/tab.service';
import { ConnectorService } from '../../../../../../shared/services/connector.service';
import { Subscription } from 'rxjs';
import { TabComponent } from '../../../../../tab/tab/tab.component';


@Component({
    selector: 'app-admin-shift-reports-uploads',
    templateUrl: './reports-uploads.component.html',
    styleUrls: ['./reports-uploads.component.scss']
})
export class AdminShiftReportsUploadsComponent implements OnInit {

    @Input() shift;
    data: any = {};
    currentQuizSubscription: Subscription;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private spinner: CustomLoadingService,
        private tabService: TabService,
        private connectorService: ConnectorService
    ) {
    }

    ngOnInit() {
        this.currentQuizSubscription = this.connectorService.currentQuizTab$
            .subscribe((tab: TabComponent) => {
                if (tab) {
                    const id = tab.data.other_id;
                    if (tab.url === `admin-shift/reports-uploads/${id}/edit`) {
                        this.tabService.closeTab(tab.url);
                    }
                }
            });
        this.fetch();
    }

    async fetch() {
        try {
            this.data = await this.scheduleService.getShiftReportsUploads(this.shift.id);
        } catch (e) {
            this.displayError(e);
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
                const res = await this.scheduleService.deleteFile(file.id);
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
                const res = await this.scheduleService.deleteCompletedReport(report.id);
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
            const res = await this.scheduleService.reportsUploadsApprove(type, file.id, value);
            //this.toastr.success(res.message);
        } catch (e) {
            this.displayError(e);
            file.approved = value ? 0 : 1;
        }
    }

    openSurvey(survey) {
        const body: any = {
            view: 'contentview',
            name: survey.rname,
            other_id: survey.other_id
        };
        const tab = new Tab(
            body.name,
            'quizTpl',
            `admin-shift/reports-uploads/${body.other_id}/view`,
            body
        );
        this.tabService.openTab(tab);
    }

    editSurvey(survey) {
        const body: any = {
            view: 'contentedit',
            name: survey.rname,
            other_id: survey.other_id,
            approved: survey.approved
        };
        const tab = new Tab(
            body.name,
            'quizTpl',
            `admin-shift/reports-uploads/${body.other_id}/edit`,
            body
        );
        this.tabService.openTab(tab);
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
