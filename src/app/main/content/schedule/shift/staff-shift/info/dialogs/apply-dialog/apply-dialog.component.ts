import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-staff-shift-apply-dialog',
	templateUrl: './apply-dialog.component.html',
    styleUrls: ['./apply-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None    
})
export class StaffShiftApplyDialogComponent implements OnInit {

    form: FormGroup;

	constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<StaffShiftApplyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        
    }

	ngOnInit() {
        this.form = this.formBuilder.group({
            reason: ['']
        });

    }

    saveForm() {
        const reason = this.form.getRawValue().reason;
        this.dialogRef.close(reason);
    }

}
