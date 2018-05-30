import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StaffShiftExpeneseDialogComponent } from './expenese-dialog/expenese-dialog.component';
import { ScheduleService } from '../../../schedule.service';
import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-staff-shift-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss']
})
export class StaffShiftExpensesComponent implements OnInit {

    @Input() shift;
    expenses: any[] = [];

    constructor(
        private dialog: MatDialog,
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.shift.shift_roles.forEach(role => {
            role.pay_items.filter(v => v.item_type === 'expense' && v.type === 'staff')
                          .forEach(v => this.expenses.push(v));
        });
    }

    getExpenseCategoryName(categoryId) {
        return this.shift.expense_categories.find(v => v.id === +categoryId).cname;
    }

    addExpense() {
        const dialogRef = this.dialog.open(StaffShiftExpeneseDialogComponent, {
            disableClose: false,
            panelClass: 'staff-shift-expense-dialog',
            data: {
                mode: 'add',
                categories: this.shift.expense_categories,
                receiptRequired: this.shift.expense_receipt_required === '1' ? true : false,
                role_staff_id: this.shift.selected
            }
        });
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.scheduleService.addPayItem(result);
                    res.data = {
                        ...res.data,
                        expense_cat_id: +res.data.expense_cat_id
                    };
                    this.expenses.push(res.data);
                } catch (e) {
                    this.displayError(e);
                }

            }
        });
    }

    editExpense(expense) {
        const dialogRef = this.dialog.open(StaffShiftExpeneseDialogComponent, {
            disableClose: false,
            panelClass: 'staff-shift-expense-dialog',
            data: {
                expense,
                mode: 'save',
                categories: this.shift.expense_categories,
                receiptRequired: this.shift.expense_receipt_required === '1' ? true : false,
                role_staff_id: this.shift.selected
            }
        });
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.scheduleService.updatePayItem(expense.id, result);
                    const index = this.expenses.findIndex(v => v.id === expense.id);
                    res.data.unit_rate = +res.data.unit_rate;
                    this.expenses.splice(index, 1, res.data);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    deleteExpense(expense) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.scheduleService.deletePayItem(expense.id);
                    const index = this.expenses.findIndex(v => v.id === expense.id);
                    if (index > -1) {
                        this.expenses.splice(index, 1);
                    }
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
