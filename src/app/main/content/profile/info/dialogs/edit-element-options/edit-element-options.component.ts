import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileField } from '../../../profile-field.model';
import { ProfileInfoService } from '../../profile-info.service';
import * as _ from 'lodash';

export const ASC = 'asc';
export const DESC = 'desc';

@Component({
    selector: 'app-profile-info-edit-element-options',
    templateUrl: './edit-element-options.component.html',
    styleUrls: ['./edit-element-options.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditElementOptionsDialogComponent implements OnInit {
    sortOrder = ASC;
    field: ProfileField;
    @ViewChild('optionInput') optionInputField;

    constructor(
        public dialogRef: MatDialogRef<ProfileInfoEditElementOptionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialog: MatDialog,
        private profileInfoService: ProfileInfoService
    ) { }

    ngOnInit() {
        this.field = _.cloneDeep(this.data.field);
        const filter = this.field.filter;
        if (!filter || filter.length == 0) {
            this.field.filter = 'equals';
        }
    }

    addOption(value) {
        if (!this.field.options) { this.field.options = []; }
        this.profileInfoService.createListOption(this.field, { option: value })
            .subscribe(res => {
                const option = res.data;
                this.field.options.push(option);
                this.optionInputField.nativeElement.value = '';
                this.optionInputField.nativeElement.focus();
            });
    }

    onRemoveOption(item, index) {
        this.profileInfoService.deleteListOption(item.id)
            .subscribe(res => {
                this.field.options.splice(index, 1);
            });
    }
    
    focusOptionInputField() {
        setTimeout(() => {
            this.optionInputField.nativeElement.focus();
        });
    }

    onSortOptions() {
        this.field.options = _.orderBy(this.field.options, ['display_order'], [this.sortOrder]);
        this.sortOrder = this.sortOrder == ASC ? DESC : ASC;
    }

    onSave() {
        this.dialogRef.close(this.field);
    }
}


