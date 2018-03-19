import {
    Component, OnInit, Input,
    Output, EventEmitter
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-flag-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    @Input() flag;
    @Output() onFlagDeleted = new EventEmitter;

    form: any = {};

    formActive = false;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;


    constructor(
        private dialog: MatDialog,
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    openForm() {
        this.formActive = true;
        this.form = _.cloneDeep(this.flag);
    }

    closeForm() {
        this.formActive = false;
    }

    delete() {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.settingsService.deleteFlag(this.flag.id).subscribe(res => {
                    this.toastr.success(res.message);
                    this.onFlagDeleted.next(this.flag);
                });
            }
        });

    }

    saveForm() {
        this.formActive = false;
        this.settingsService.updateFlag(this.form.id, this.form).subscribe(res => {
            this.toastr.success(res.message);
            this.flag = this.form;
        });
        this.formActive = false;
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}
