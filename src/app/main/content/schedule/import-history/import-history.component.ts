import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as _ from 'lodash';

import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../schedule.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

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
        private spinner: CustomLoadingService,
        private scMessageService: SCMessageService
    ) { }

    async ngOnInit() {
        try {
            this.spinner.show();
            this.history = await this.scheduleService.getImportHistory();
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            this.scMessageService.error(e);
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
                    this.spinner.show();
                    await this.scheduleService.deleteHistory(item.id);
                    this.spinner.hide();
                    const index = this.history.findIndex(v => v.id === item.id);
                    if (index > -1) {
                        this.history.splice(index, 1);
                    }
                } catch (e) {
                    this.spinner.hide();
                    this.scMessageService.error(e);
                }
            }
        });
    }

}
