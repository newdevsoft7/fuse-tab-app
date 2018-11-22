import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '@main/content/users/user.service';
import { FilterService } from '@shared/services/filter.service';
import { SettingsService } from '@main/content/settings/settings.service';

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
        private filterService: FilterService
    ) {}

    async ngOnInit() {
        this.reportForm = this.formBuilder.group({
            report_id: [null],
            deadline: [null],
            completitions: [null],
        });

        this.reportControl.valueChanges
          .startWith('')
          .debounceTime(300)
          .distinctUntilChanged()
          .subscribe(val => {
              if (typeof val === 'string') {
                  this.filterService.getReportFilter('quiz', val).then(reports => this.filteredReports = reports);
              }
          });
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
    }

}
