import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';

import { ScheduleService } from '../schedule/schedule.service';

import { ClientInvoiceListComponent } from './admin/client-invoice-list/client-invoice-list.component';
import { ClientInvoiceDetailComponent } from './admin/client-invoice-detail/client-invoice-detail.component';
import { ClientNewInvoiceComponent } from './admin/client-new-invoice/client-new-invoice.component';
import { StaffInvoicesGenerationComponent } from './admin/staff-invoices-generation/staff-invoices-generation.component';
import { StaffInvoiceListComponent } from './admin/staff-invoice-list/staff-invoice-list.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CommonModule
    ],
    declarations: [
        // For Admin User
        ClientInvoiceListComponent,
        ClientInvoiceDetailComponent,
        ClientNewInvoiceComponent,
        StaffInvoicesGenerationComponent,
        StaffInvoiceListComponent
    ],
    providers: [
        ScheduleService
    ],
    entryComponents: [
    ],
    exports: [
        // For Admin User
        StaffInvoicesGenerationComponent,
        ClientInvoiceListComponent,
        StaffInvoiceListComponent
    ]
})
export class AccountingModule { }
