import {
        Component, OnInit, Input, ViewChild,
        ViewEncapsulation, Output, EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-work-group-item',
    templateUrl: './work-group-item.component.html',
    styleUrls: ['./work-group-item.component.scss']
})
export class SettingsWorkGroupItemComponent implements OnInit {

    @ViewChild('nameInput') nameInputField;
    @Input() category;
    @Input() selected = false;
    @Output() onCategoryDeleted = new EventEmitter;

    form: FormGroup;
    formActive = false;

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
            cname: [this.category.cname, Validators.required],
        });
        this.formActive = true;
        this.focusNameField();
    }

    saveForm() {
        const cname = this.form.getRawValue().cname;
        this.settingsService.updateWorkAreaCategory(this.category.id, cname).subscribe(res => {
            this.category.cname = cname;
            //this.toastr.success(res.message);
        }, err => {
            this.displayError(err);
        });
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

    delete(category, event) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.settingsService.deleteWorkAreaCategory(this.category.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    this.onCategoryDeleted.next(this.category);
                });
            }
        });
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
