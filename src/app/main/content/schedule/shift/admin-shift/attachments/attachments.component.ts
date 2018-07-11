import {
    Component, OnInit, Input, OnChanges, SimpleChanges,
    ViewChild, ElementRef
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../../../schedule.service';

@Component({
    selector: 'app-admin-shift-attachments',
    templateUrl: './attachments.component.html',
    styleUrls: ['./attachments.component.scss']
})
export class AdminShiftAttachmentsComponent implements OnInit, OnChanges {

    @Input() shift;
    @ViewChild('uploadFile') uploadFile: ElementRef;
    
    notes: string;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    files: any[] = [];

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() {
        this.uploadFile.nativeElement.onchange = (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.fileUpload(files[0]);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.shift && changes.shift.firstChange) {
            this.notes = this.shift.notes;
            this.files = this.shift.files;
        }
    }

    saveNotes(notes) {
        this.scheduleService.updateShift(this.shift.id, { notes })
            .subscribe(res => {
                //this.toastr.success(res.message);
                this.shift.notes = this.notes;
            }, err => {
                this.toastr.error(err.error.message);
            });
    }

    async fileUpload(file: File): Promise<any> {
        try {
            this.spinner.show();
            const res = await this.scheduleService.uploadFile(this.shift.id, file);
            this.spinner.hide();
            //this.toastr.success(res.message);
            const item = {
                ...res.data.file,
                thumb: res.data.thumb,
                link: res.data.link,
            };
            this.files.push(item);
        } catch (e) {
            this.spinner.hide();
            this.displayError(e);
        }
    }

    delete(file) {
        const msg = file.ftype === 'shift' ?
            'Really delete this?' : 'Really delete this? Warning - this file is linked to a tracking option.';
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.dialogRef.componentInstance.confirmMessage = msg;
        this.dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    this.spinner.show();
                    const res = await this.scheduleService.deleteFile(file.id);
                    this.spinner.hide();
                    //this.toastr.success(res.message);
                    const index = this.files.findIndex(v => v.id === file.id);
                    if (index > -1) {
                        this.files.splice(index, 1);
                    }
                } catch (e) {
                    this.spinner.hide();
                    this.toastr.error(e.error.message);
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
            this.toastr.error(e.error.message);
        }
    }
}
