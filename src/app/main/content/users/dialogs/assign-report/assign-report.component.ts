import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { UserService } from '../../user.service';
import { SettingsService } from '../../../settings/settings.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent  } from '@angular/material';



@Component({
    selector: 'app-users-assign-report-dialog',
    templateUrl: './assign-report.component.html',
    styleUrls: ['./assign-report.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AssignReportDialogComponent implements OnInit {

    quizes: any[] = [];
    reportForm: FormGroup;

    selectedReport: any;

    filteredReports = [];
    reportControl: FormControl = new FormControl();


    constructor(
        public dialogRef: MatDialogRef<AssignReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private settingsService: SettingsService,
        private userService: UserService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private tokenStorage: TokenStorage) {

    }

    async ngOnInit() {
        this.reportForm = this.formBuilder.group({
            report_id: [null],
            deadline: [null],
            completitions: [null],
        });
        this.getQuizes();


        this.reportControl.valueChanges
          .startWith('')
          .debounceTime(300)
          .distinctUntilChanged()
          .subscribe(val => {
              console.log(val);
              if (typeof val === 'string') {
                  this.settingsService.getQuizesAutoComplete(val.trim().toLowerCase()).subscribe(res => {
                      console.log(res);
                      if (res.length > 0) {
                          this.filteredReports = res;
                      }
                  });
              }
          });
    }

    onUserFormLvlChanged() {

    }

    onSave() {
        const assignedReport = this.selectedReport;
        this.dialogRef.close(assignedReport);
    }

    reportDisplayFn(value: any): string {
        return value && typeof value === 'object' ? value.rname : value;
    }

    selectReport(event: MatAutocompleteSelectedEvent) {
        this.selectedReport = event.option.value;
        console.log(this.selectedReport);
    }

    getQuizes() {
        this.settingsService.getReports().subscribe(quizes => {
            this.quizes = quizes;
        });
    }

}
