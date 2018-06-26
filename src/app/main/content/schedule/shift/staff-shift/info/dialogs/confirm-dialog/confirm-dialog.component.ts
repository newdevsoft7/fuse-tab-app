import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tab } from '../../../../../../../tab/tab';
import { TabService } from '../../../../../../../tab/tab.service';

@Component({
    selector: 'app-staff-shift-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class StaffShiftConfirmDialogComponent implements OnInit {

    forms: any = [];
    shiftId: number;

    constructor(
        private tabService: TabService,
        public dialogRef: MatDialogRef<StaffShiftConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.forms = data.forms;
        this.shiftId = data.shift_id;
    }

    ngOnInit() {
    }

    openForm(form) {
        const tab = new Tab(
            form.fname,
            'formTpl',
            `form_confirm/${this.shiftId}/${form.other_id}`,
            form
        );
        this.tabService.openTab(tab);
        this.dialogRef.close();
    }
}
