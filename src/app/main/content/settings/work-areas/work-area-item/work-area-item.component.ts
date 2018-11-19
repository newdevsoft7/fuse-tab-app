import {
    Component, OnInit, Input,
    ViewChild, EventEmitter, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

import { SettingsService } from '../../settings.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';
import { FilterService } from '@shared/services/filter.service';

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
        private scMessageService: SCMessageService,
        private dialog: MatDialog,
        private filterService: FilterService
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
                this.settingsService.deleteWorkArea(this.workArea.id).subscribe(() => {
                    this.onWorkAreaDeleted.next(this.workArea);
                    this.filterService.clean(this.filterService.type.workareas);
                });
            }
        });

    }

    saveForm() {
        const params = this.form.value;
        if (!params.php_tz) { delete params.php_tz; }
        this.settingsService.updateWorkArea(this.workArea.id, params).subscribe(() => {
            this.workArea = { ...this.workArea, ...params };
            this.filterService.clean(this.filterService.type.workareas);
        }, err => {
            this.scMessageService.error(err);
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

}
