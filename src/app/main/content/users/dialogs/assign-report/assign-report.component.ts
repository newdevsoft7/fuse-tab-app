import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { UserService } from '../../user.service';
import { SettingsService } from '../../../settings/settings.service';

@Component({
    selector: 'app-users-assign-report-dialog',
    templateUrl: './assign-report.component.html',
    styleUrls: ['./assign-report.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AssignReportDialogComponent implements OnInit {

    quizes: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<AssignReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private settingsService: SettingsService,
        private userService: UserService,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage) {

    }

    ngOnInit() {
        this.getQuizes();
    }

    onUserFormLvlChanged() {

    }

    onSave() {

    }

    onUpdateAttribute(attribute) {
        console.log(attribute);
        console.log(this.quizes);
    }

    getQuizes() {
        this.settingsService.getSurveysAndReports().subscribe(quizes => {
            console.log(quizes);
            this.quizes = quizes;
        });
    }

}
