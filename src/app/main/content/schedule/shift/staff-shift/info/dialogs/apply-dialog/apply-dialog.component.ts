import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TokenStorage } from '../../../../../../../../shared/services/token-storage.service';
import { TabService } from '../../../../../../../tab/tab.service';
import { Tab } from '../../../../../../../tab/tab';

@Component({
    selector: 'app-staff-shift-apply-dialog',
    templateUrl: './apply-dialog.component.html',
    styleUrls: ['./apply-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftApplyDialogComponent implements OnInit {

    form: FormGroup;
    settings: any = {};
    placeholder = '';
    forms: any = [];
    shiftId: number;

    constructor(
        private tabService: TabService,
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<StaffShiftApplyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.settings = this.tokenStorage.getSettings();
        this.forms = data.forms;
        this.shiftId = data.shift_id;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            reason: ['']
        });

    }

    saveForm() {
        const reason = this.form.getRawValue().reason;
        if (this.settings.shift_application_reason == '1' && reason.length < 2) {
            this.toastr.error('Please enter a reason for you application.');
            return;
        } else {
            this.dialogRef.close(reason);
        }
    }

    openForm(form) {
        const tab = new Tab(
            form.fname,
            'formTpl',
            `form_apply/${this.shiftId}/${form.other_id}`,
            form
        );
        this.tabService.openTab(tab);
        this.dialogRef.close();
    }
}
