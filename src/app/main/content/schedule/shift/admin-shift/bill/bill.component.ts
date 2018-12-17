import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../shared/services/custom-loading.service';

import * as _ from 'lodash';
import { ScheduleService } from '../../../schedule.service';
import { AddPayItemDialogComponent } from '../staff/selected/add-pay-item-dialog/add-pay-item-dialog.component';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';


@Component({
    selector: 'app-admin-shift-bill',
    templateUrl: './bill.component.html',
    styleUrls: ['./bill.component.scss']
})
export class AdminShiftBillComponent implements OnInit {

    @Input() shift;
    @Input() currencies;

    readonly types: string[] = [
        'bonus',
        'deduction',
        'expense',
        'travel',
        'other'
    ];

    constructor(
        private dialog: MatDialog,
        private scheduleService: ScheduleService,
        private scMessageService: SCMessageService,
    ) {
    }

    ngOnInit() {
    }

    addBillItem() {
        const dialogRef = this.dialog.open(AddPayItemDialogComponent, {
            disableClose: false,
            panelClass: 'add-pay-item-dialog',
            data: {
                from: 'bill',
                currencies: this.currencies
            }
        });

        dialogRef.afterClosed().subscribe(async (data) => {
            if (data !== false) {
                try {
                    data = {
                        ...data,
                        shift_id: this.shift.id
                    };
                    const res = await this.scheduleService.addPayItem(data);

                    const item = {
                        ...res.data,
                        title: res.data.item_name,
                        bill_total: res.data.bill_unit_rate * res.data.bill_units
                    };
                    
                    if (!this.shift.bill_items[data.item_type]) {
                        this.shift.bill_items[data.item_type] = [];
                    }
                    this.shift.bill_items[data.item_type].push(item);
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    async deleteItem(item, type) {
        try {
            await this.scheduleService.deletePayItem(item.id);
            const index = this.shift.bill_items[type].findIndex(v => v.id === item.id);
            if (index > -1) {
                this.shift.bill_items[type].splice(index, 1);
            }
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async onItemChanged(value: any, type: string, field: string, item: any) {
        if (type === 'staff') {
            let key;
            switch (field) {
                case 'bill_unit_rate':
                    key = 'bill_rate';        
                    break;
                default:
                    key = field;
                    break;
            }
            this.scheduleService.updateRoleStaff(item.id, { [key]: value }).subscribe(() => {
                item[field] = value;
                //this.toastr.success(res.message);
                this.recalculateItemTotal(item, type);
            });
        } else {
            let key;
            switch (field) {
                case 'title':
                    key = 'item_name'
                    break;
                default:
                    key = field;
                    break;
            }
            try {
                const res = await this.scheduleService.updatePayItem(
                    item.id,
                    {
                        [key]: value,
                        role_staff_id: item.role_staff_id
                    });
                //this.toastr.success(res.message);
                item[field] = value;
                item.id = res.data.id;
                this.recalculateItemTotal(item, type);
            } catch (e) {
                this.scMessageService.error(e);
            }  
        }
    }

    recalculateItemTotal(item: any, type: string) {
        if (type === 'staff') {
            if (item.bill_rate_type && item.bill_unit_rate) {
                item.bill_total = item.bill_rate_type === 'flat' ? item.bill_unit_rate : item.bill_unit_rate * item.hours;
            } else {
                item.bill_total = null;
            }
        } else {
            item.bill_total = item.bill_unit_rate && item.bill_units ? item.bill_unit_rate * item.bill_units : null;
        }
    }

    download(file: any) {
        const index = file.path.indexOf('/api/');
        this.scheduleService.download(file.path.substr(index + 5), `${file.oname}.${file.ext}`);
    }

}
