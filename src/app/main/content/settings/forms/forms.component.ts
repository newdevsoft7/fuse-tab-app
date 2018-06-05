import {
    Component, OnInit, Input, ViewEncapsulation, ViewChild,
    Output, EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDrawer, MatDialog, MatDialogRef } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { SettingsService } from '../settings.service';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { TrackingService } from '../../tracking/tracking.service';
import { Tab } from '../../../tab/tab';
import { TabService } from '../../../tab/tab.service';

@Component({
    selector: 'app-settings-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsFormsComponent implements OnInit {

    @ViewChild('drawer') drawer: MatDrawer;

    _settings = [];

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    forms: any[] = [];
    form: any = null;
    selectedForm: any = null;

    trackingOptions: any[] = [];
    filteredOptions: any[] = [];

    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    trackingFilter: FormControl = new FormControl();
    trackRequirement = 'apply';
    levelRequirement = 'apply';
    level;

    getTrackingOptionName;

    readonly levels = [
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
        { label: 'Registrant', value: 'registrant' },
        { label: 'Client', value: 'client' },
        { label: 'Ext', value: 'ext' }
    ];

    constructor(
        private settingsService: SettingsService,
        private trackingService: TrackingService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private tabService: TabService,
        private toastrService: ToastrService
    ) { }

    ngOnInit() {
        this.getForms();
        this.getTrackingOptions();

        this.trackingFilter
            .valueChanges
            .map(value => typeof value === 'string' ? value : value.oname)
            .subscribe(val => {
                this.filteredOptions = [];
                this.trackingOptions.forEach(c => {
                    const category = { ...c };
                    const options = c.options.filter(o => o.oname.toLowerCase().includes(val.toLowerCase()));
                    if (options.length > 0) {
                        category.options = options;
                        this.filteredOptions.push(category);
                    }
                });
            });

        if (window.addEventListener) {
            window.addEventListener('message', this.onMessage.bind(this), false);
        } else if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
        }
    }

    getForms() {
        this.settingsService.getForms().subscribe(forms => {
            this.forms = forms;
            if (forms.length > 0) {
                this.selectForm(this.forms[0]);
            }
        });
        this.drawer.open();
    }

    getForm(id) {
        this.settingsService.getForm(id).subscribe(form => this.form = form);
    }

    selectForm(form) {
        this.selectedForm = form;
        this.getForm(form.id);
        this.trackingFilter.setValue('');
    }

    deleteForm(id, event: MouseEvent) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const index = this.forms.findIndex(v => v.id === id);
                    if (index > -1) { this.forms.splice(index, 1); }
                    await this.settingsService.deleteForm(id);
                } catch (e) {
                    this.handleError(e);
                }
            }
        });
        event.stopPropagation();
    }

    getTrackingOptions() {
        Promise.all([
            this.trackingService.getTrackingCategories().toPromise(),
            this.trackingService.getTrackingOptions().toPromise()
        ]).then(([categories, options]) => {

            this.getTrackingOptionName = (id) => {
                return options.find(o => o.id === id).oname;
            };

            this.trackingOptions = categories.map(c => {
                const os = options.filter(o => o.tracking_cat_id === c.id);
                c.options = os;
                return c;
            });
            this.filteredOptions = _.cloneDeep(this.trackingOptions);
        });
    }

    addTrackRequirement() {
        const tracking_option_id = this.trackingFilter.value.id;
        if (!tracking_option_id) { return; }
        this.settingsService.addFormTrackRequirement(this.form.id, this.trackRequirement, tracking_option_id).subscribe(res => {
            //this.toastr.success(res.message);
            this.form.required_tracks.push(res.data);
        });
    }

    addLevelRequirement() {
        if (!this.level || !this.levelRequirement) { return; }
        this.settingsService.addFormLevelRequirement(this.form.id, this.levelRequirement, this.level).subscribe(res => {
            //this.toastr.success(res.message);
            this.form.required_lvls.push(res.data);
        });
    }

    deleteLevelRequirement(id) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.settingsService.deleteFormLevelRequirement(id).subscribe(res => {
                    //this.toastr.success(res.message);
                    const index = this.form.required_lvls.findIndex(r => r.id === id);
                    this.form.required_lvls.splice(index, 1);
                });
            }
        });
    }

    deleteTrackRequirement(id) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.settingsService.deleteFormTrackRequirement(id).subscribe(res => {
                    //this.toastr.success(res.message);
                    const index = this.form.required_tracks.findIndex(r => r.id === id);
                    this.form.required_tracks.splice(index, 1);
                });
            }
        });
    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.oname : value;
    }

    async editForm(form, event: MouseEvent) {
        event.stopPropagation();
        try {
            const res = await this.settingsService.getForm(form.id).toPromise();
            res.isEdit = true;
            const tab = new Tab(
                form.fname,
                'formTpl',
                `settings/form/${form.id}`,
                res
            );
            this.tabService.openTab(tab);
        } catch (e) {
            this.handleError(e.error);
        }
    }

    addForm(): void {
        const tab = new Tab(
            'New Form',
            'formTpl',
            `settings/form/new`,
            {
                name: 'New Form'
            }
        );
        this.tabService.openTab(tab);
    }

    onMessage(event: any) {
        if (event.data && event.data.func && this.tabService.currentTab.url.indexOf('settings/form') > -1) {
            this.tabService.closeTab(this.tabService.currentTab.url);
        }
    }

    handleError(e): void {
        this.toastrService.error(e.message || 'Something is wrong');
    }
}
