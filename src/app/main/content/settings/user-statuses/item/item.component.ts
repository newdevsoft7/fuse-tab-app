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
    selector: 'app-settings-status-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class UserStatusItemComponent implements OnInit {

    @Input() status;
    @Output() onStatusDeleted = new EventEmitter;

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
        this.form = _.cloneDeep(this.status);
        this.form.sname = this.form.name;
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
                this.settingsService.deleteUserStatus(this.status.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    this.onStatusDeleted.next(this.status);
                });
            }
        });

    }

    saveForm() {
        if (this.form.color_editable || this.form.editable) {
            let data: any = {};
            if (this.form.editable) { data.sname = this.form.sname; }
            if (this.form.color_editable) { data.color = this.form.color; }
            this.settingsService.updateUserStatus(this.form.id, data).subscribe(res => {
                //this.toastr.success(res.message);
                this.status.name = res.data.sname;
                this.status.color = res.data.color;
            }, err => {
                this.toastr.error(err.error.message)
            });
        }
        
        this.formActive = false;
    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}
