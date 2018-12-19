import {
  Component, OnInit, Input, SimpleChanges,
  OnChanges, Output, EventEmitter, OnDestroy
} from '@angular/core';

import { FormControl } from '@angular/forms'

import { Subject } from 'rxjs/Subject';

import { MatSlideToggleChange, MatSelectChange, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';
import { AddInvoiceItemDialogComponent } from '@main/content/settings/staff-invoices/add-item-dialog/add-item-dialog.component';
import { Subscription } from 'rxjs/Subscription';

enum Setting {
    staff_invoice_enable = 78,
    staff_invoice_default = 79,
    staff_invoice_combine = 80,
    staff_invoice_weekly = 81,
    staff_invoice_deadline = 82,
    staff_invoice_msg_creation = 83,
    staff_invoice_top = 84,
    staff_invoice_financial = 85,
    staff_invoice_per_shift = 104
}

@Component({
    selector: 'app-settings-staff-invoices',
    templateUrl: './staff-invoices.component.html',
    styleUrls: ['./staff-invoices.component.scss']
})
export class SettingsStaffInvoicesComponent implements OnInit, OnChanges, OnDestroy {

    _settings = [];

    invoiceTopIds = [];
    invoiceBottomIds = [];

    invoiceTops = [];
    invoiceBottoms = [];

    availableInvoiceTops = [];
    availableInvoiceBottoms = [];

    onItemAdded: Subject<any> = new Subject();

    onItemAddedSubscription: Subscription;

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    items: any = {}; // All Settings

    // Slide Togglable Items
    checkableItems = [
        Setting.staff_invoice_enable,
        Setting.staff_invoice_combine,
        Setting.staff_invoice_weekly,
        Setting.staff_invoice_per_shift
    ];

    // Number Items
    numberItems = [
        Setting.staff_invoice_deadline
    ];

    invoices = [
        { label: 'All', value: 'all' },
        { label: 'Specify', value: 'specify' }
    ];

    // Form Controls
    invoiceDeadline = new FormControl();

    componentDestroyed = new Subject();

    constructor(
        private settingsService: SettingsService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes.settings || changes.options) {
            
            const keys = Object.keys(this.Setting).filter(v => _.isNumber(_.toNumber(v))) as string[];

            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['id', _.toNumber(v)]);
                if (!_.isUndefined(item)) {
                    if (this.checkableItems.includes(item.id)) { // Slide Togglable Items
                        this.items = { ...this.items, [item.id]: _.toInteger(item.value) === 0 ? false : true };
                    } else if (this.numberItems.includes(item.id)) { // Number Fields
                        switch (item.id) {
                            case Setting.staff_invoice_deadline:
                                this.invoiceDeadline.patchValue(item.value);
                                break;
                            
                            default:
                                break;
                        }
                    } else { // Text Fields
                        if (item.id === Setting.staff_invoice_top) {
                            if (changes.options) {
                              this.invoiceTopIds = !item.value ? [] : item.value.split(',').map(k => +k);
                              this.availableInvoiceTops = this.options[Setting.staff_invoice_top];
                              this.invoiceTops = this.sort(this.availableInvoiceTops.filter(top => this.invoiceTopIds.indexOf(top.id) > -1), this.invoiceTopIds);
                            }
                        } else if (item.id === Setting.staff_invoice_financial) {
                            if (changes.options) {
                              this.invoiceBottomIds = !item.value ? [] : item.value.split(',').map(k => +k);
                              this.availableInvoiceBottoms = this.options[Setting.staff_invoice_financial];
                              this.invoiceBottoms = this.sort(this.availableInvoiceBottoms.filter(top => this.invoiceBottomIds.indexOf(top.id) > -1), this.invoiceBottomIds);
                            }
                        } else {
                            this.items = { ...this.items, [item.id]: item.value };
                        }
                    }
                }
            });
        }

    }

    ngOnInit() {
        // Invoice Deadline Control
        this.invoiceDeadline.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                this.onChange(Setting.staff_invoice_deadline, value);
            });

        this.onItemAddedSubscription = this.onItemAdded.subscribe(async ({ item, type }) => {
          this.addItem(item, type);
        });
    }

    ngOnDestroy() {
        this.onItemAddedSubscription.unsubscribe();
    }

    onChange(id: Setting, event: MatSlideToggleChange | MatSelectChange | string) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        let value;

        if (event instanceof MatSlideToggleChange) { // Slide Toggle
            value = event.checked ? 1 : 0;
        } else if (event instanceof MatSelectChange) { // Select Box
            value = event.value;
        } else { // Input Text
            value = event;
        }
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
        });
    }

    openInvoiceItemsDialog(type) {
        const dialogRef = this.dialog.open(AddInvoiceItemDialogComponent, {
            disableClose: false,
            panelClass: 'add-invoice-item-dialog',
            data: {
                type,
                items: type === 'top' ?
                    this.availableInvoiceTops.filter(v => this.invoiceTopIds.indexOf(v.id) < 0) :
                    this.availableInvoiceBottoms.filter(v => this.invoiceBottomIds.indexOf(v.id) < 0),
                onItemAdded: this.onItemAdded
            }
        });
        dialogRef.afterClosed().subscribe(res => {});
    }

    addItem(item, type) {
        if (type === 'top') {
            this.invoiceTops.push(item);
            this.updateInvoiceTops();
        } else {
            this.invoiceBottoms.push(item);
            this.updateInvoiceBottoms();
        }
    }

    removeItem(item, type) {
        if (type === 'top') {
            this.invoiceTops.splice(this.invoiceTops.findIndex(v => v.id === item.id), 1);
            this.updateInvoiceTops();
        } else {
            this.invoiceBottoms.splice(this.invoiceBottoms.findIndex(v => v.id === item.id), 1);
            this.updateInvoiceBottoms();
        }
    }

    private updateInvoiceBottoms() {
        this.invoiceBottomIds = this.invoiceBottoms.map(v => v.id);
        const value = this.invoiceBottomIds.join(',');
        this.onChange(Setting.staff_invoice_financial, value);
    }

    private updateInvoiceTops() {
        this.invoiceTopIds = this.invoiceTops.map(v => v.id);
        const value = this.invoiceTopIds.join(',');
        this.onChange(Setting.staff_invoice_top, value);
    }

    onDrop(evt, type) {
        if (type === 'top') {
            this.updateInvoiceTops();
        } else {
            this.updateInvoiceBottoms();
        }
    }

    private sort(items, orders): any[] {
        const results: any[] = [];
        orders.forEach(id => {
            const index = items.findIndex(item => item.id === id);
            if (index > -1) {
                results.push(items[index]);
            }
        });
        return results;
    }
}
