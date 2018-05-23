import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../schedule.service';

@Component({
    selector: 'app-import-history',
    templateUrl: './import-history.component.html',
    styleUrls: ['./import-history.component.scss']
})
export class ImportHistoryComponent implements OnInit {

    history: any[] = [];
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private scheduleService: ScheduleService,
        private toastr: ToastrService,
        private spinner: CustomLoadingService
    ) { }

    async ngOnInit() {
        try {
            this.spinner.show();
            this.history = await this.scheduleService.getImportHistory();
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            this.displayError(e);
        }
    }

    async delete(item) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    // TODO - Delete import history
                    this.spinner.show();
                    const res = await this.scheduleService.deleteImport(item.id);
                    this.spinner.hide();
                    //this.toastr.success(res.message);
                    const index = this.history.findIndex(v => v.id === item.id);
                    if (index > -1) {
                        this.history.splice(index, 1);
                    }
                } catch (e) {
                    this.spinner.hide();
                    this.displayError(e);
                }
            }
        });
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
