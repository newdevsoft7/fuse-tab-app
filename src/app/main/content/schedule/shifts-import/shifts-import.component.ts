import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { fuseAnimations } from '../../../../core/animations';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../schedule.service';
import { TabService } from '../../../tab/tab.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-shifts-import',
    templateUrl: './shifts-import.component.html',
    styleUrls: ['./shifts-import.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ShiftsImportComponent implements OnInit {

    result: any;
    columns: string[] = [];
    live = true;
    warnings: string[] = [];

    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(
        private dialog: MatDialog,
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private scMessageService: SCMessageService
    ) { }

    ngOnInit() {
        this.fileInput.nativeElement.onchange = (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.uploadFile(files[0]);
            }
        };
    }

    async uploadFile(file: File) {

        // Validate file extension
        const valid = [
            'csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ].includes(file.type);

        if (!valid) {
            this.toastr.error('File type should be one of .csv, .xls, .xlsx');
            return;
        }

        try {
            this.spinner.show();
            this.result = await this.scheduleService.importShift(file);
            this.warnings = this.result.warnings;
            this.spinner.hide();
            if (this.result.data.length > 0) {
                this.columns = Object.keys(this.result.data[0]).filter(v => v !== 'id');
            }
        } catch (e) {
            this.spinner.hide();
            this.scMessageService.error(e);
            this.warnings = e.error.warnings;
        }

    }

    typeof(v) {
        return typeof(v);
    }

    async save() {
        try {
            this.spinner.show();
            const res = await this.scheduleService.saveImport(this.result.shift_import_id, this.live);
            this.spinner.hide();
            //this.toastr.success(res.message);
            this.tabService.closeTab('schedule/import-shifts');
        } catch (e) {
            this.spinner.hide();
            this.scMessageService.error(e);
        }
    }

    discard() {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    this.spinner.show();
                    const res = await this.scheduleService.deleteImport(this.result.shift_import_id);
                    this.spinner.hide();
                    //this.toastr.success(res.message);
                    this.result = null;
                } catch (e) {
                    this.spinner.hide();
                    this.scMessageService.error(e);
                }
            }
        });
    }

    deleteItem(item) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    this.spinner.show();
                    const res = await this.scheduleService.deleteShift(item.id);
                    this.spinner.hide();
                    //this.toastr.success(res.message);
                    const index = this.result.data.findIndex(v => v.id === item.id);
                    if (index > -1) {
                        const temp = [ ... this.result.data ];
                        temp.splice(index, 1);
                        this.result.data = temp;
                    }
                } catch (e) {
                    this.spinner.hide();
                    this.scMessageService.error(e);
                }
            }
        });
    }

}
