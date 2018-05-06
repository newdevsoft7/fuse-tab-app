import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { PayrollComponent } from './payroll.component';
import { GeneratePayrollComponent } from './generate-payroll/generate-payroll.component';
import { PayrollService } from './payroll.service';
import { PayrollSearchBarComponent } from './search-bar/search-bar.component';
import { PayrollDetailComponent } from './detail/detail.component';

@NgModule({
    imports         : [
        CommonModule,
        SharedModule
    ],
    declarations    : [
        PayrollComponent,
        GeneratePayrollComponent,
        PayrollSearchBarComponent,
        PayrollDetailComponent
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
    ]
})
export class PayrollModule { }
