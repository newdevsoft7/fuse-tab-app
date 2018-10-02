import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { CustomMultiSelectModule } from '../../../core/components/custom-multi-select/custom-multi-select.module';
import { PayrollComponent } from './payroll.component';
import { GeneratePayrollComponent } from './generate-payroll/generate-payroll.component';
import { PayrollService } from './payroll.service';
import { PayrollSearchBarComponent } from './search-bar/search-bar.component';
import { PayrollDetailComponent } from './detail/detail.component';
import { PayrollExportAsCsvDialogComponent } from './dialogs/export-as-csv-dialog/payroll-export-as-csv-dialog.component';

@NgModule({
    imports         : [
        CommonModule,
        SharedModule,
        CustomMultiSelectModule
    ],
    declarations    : [
        PayrollComponent,
        GeneratePayrollComponent,
        PayrollSearchBarComponent,
        PayrollDetailComponent,
        PayrollExportAsCsvDialogComponent
    ],
    exports         : [
        PayrollComponent,
        GeneratePayrollComponent,
        PayrollDetailComponent
    ],
    providers       : [
        PayrollService
    ],
    entryComponents : [
        PayrollExportAsCsvDialogComponent
    ]
})
export class PayrollModule { }
