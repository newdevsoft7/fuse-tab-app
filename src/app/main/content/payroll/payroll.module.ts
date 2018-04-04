import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { PayrollComponent } from './payroll.component';
import { GeneratePayrollComponent } from './generate-payroll/generate-payroll.component';
import { PayrollService } from './payroll.service';

@NgModule({
    imports         : [
        CommonModule,
        SharedModule
    ],
    declarations    : [
        PayrollComponent,
        GeneratePayrollComponent
    ],
    exports         : [
        PayrollComponent,
        GeneratePayrollComponent
    ],
    providers       : [
        PayrollService
    ],
    entryComponents : [
    ]
})
export class PayrollModule { }
