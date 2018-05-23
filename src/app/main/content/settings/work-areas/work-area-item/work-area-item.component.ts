import {
    Component, OnInit, Input,
    ViewChild, EventEmitter, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-work-area-item',
    templateUrl: './work-area-item.component.html',
    styleUrls: ['./work-area-item.component.scss']
})
export class SettingsWorkAreaItemComponent implements OnInit {

    @ViewChild('nameInput') nameInputField;
    @Input() workArea;
    @Input() timezones = [];
    @Output() onWorkAreaDeleted = new EventEmitter;

    formActive = false;
    form: FormGroup;

    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;


    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
    }

    focusNameField() {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    openForm() {
        this.form = this.formBuilder.group({
            aname: [this.workArea.aname, Validators.required],
            php_tz: [this.workArea.php_tz],
            work_area_cat_id: [this.workArea.work_area_cat_id],
        });
        this.formActive = true;
        this.focusNameField();
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
                this.settingsService.deleteWorkArea(this.workArea.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    this.onWorkAreaDeleted.next(this.workArea);
                });
            }
        });

    }

    saveForm() {
        const params = this.form.value;
        this.settingsService.updateWorkArea(this.workArea.id, params).subscribe(res => {
            this.workArea = { ...this.workArea, ...params };
            //this.toastr.success(res.message);
        }, err => {
            this.displayError(err);
        });
        this.formActive = false;
    }

    getTimezone() {
        if (!this.workArea.php_tz) { 
            return 'Empty';
        } else {
            if (this.timezones) {
                const index = _.findIndex(this.timezones, ['value', this.workArea.php_tz]);
                return index > -1 ? this.timezones[index].label : this.workArea.php_tz;
            }
        }

    }

    private displayError(err) {
        const errors = err.error.errors;
        Object.keys(errors).forEach(v => {
            this.toastr.error(errors[v]);
        });
    }

}
