import {
    Component, OnInit, Input,
    ViewChild, EventEmitter, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-pay-level-item',
    templateUrl: './pay-level-item.component.html',
    styleUrls: ['./pay-level-item.component.scss']
})
export class SettingsPayLevelItemComponent implements OnInit {

    @ViewChild('nameInput') nameInputField;
    @Input() level;
    @Output() onLevelDeleted = new EventEmitter;

    formActive = false;
    form: FormGroup;

    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    readonly TYPE = [
        { label: '/hr', value: 'phr' },
        { label: 'flat', value: 'flat' }
    ];

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
            pname: [this.level.pname, Validators.required],
            pay_rate: [this.level.pay_rate, Validators.required],
            pay_rate_type: [this.level.pay_rate_type, Validators.required],
            pay_cat_id: [this.level.pay_cat_id]
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
                this.settingsService.deletePayLevel(this.level.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    this.onLevelDeleted.next(this.level);
                });
            }
        });

    }

    saveForm() {
        const params = this.form.value;
        this.settingsService.updatePayLevel(this.level.id, params).subscribe(res => {
            this.level = { ...this.level, ...params };
            //this.toastr.success(res.message);
        }, err => {
            this.displayError(err);
        });
        this.formActive = false;
    }

    private displayError(e) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }

}
