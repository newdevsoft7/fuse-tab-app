import { Component, ViewChild, OnInit, OnDestroy, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { FuseNavigationService } from '../../../core/components/navigation/navigation.service';
import { FuseNavigationModel } from '../../../navigation/navigation.model';
import { AuthenticationService } from '../../../shared/services/authentication.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { TabsComponent } from '../../tab/tabs/tabs.component';
import { Tab } from '../../tab/tab';
import { TabService } from '../../tab/tab.service';

import * as TAB from '../../../constants/tab';
import { TrackingService } from '../tracking/tracking.service';
import { TrackingCategory } from '../tracking/tracking.models';

import { FCMService } from '../../../shared/services/fcm.service';
import { SocketService } from '../../../shared/services/socket.service';
import { TokenStorage } from '../../../shared/services/token-storage.service';

import 'rxjs/add/operator/skipWhile';

import { ShiftsExportAsExcelDialogComponent } from '../schedule/shifts-export/client/shifts-export-as-excel-dialog/shifts-export-as-excel-dialog.component';
import { ShiftsExportAsPdfDialogComponent } from '../schedule/shifts-export/client/shifts-export-as-pdf-dialog/shifts-export-as-pdf-dialog.component';
import { UsersExportDialogComponent } from '../users/users-export-dialog/users-export-dialog.component';
import { TabComponent } from '../../tab/tab/tab.component';

@Component({
    selector   : 'fuse-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class FuseHomeComponent implements OnInit, OnDestroy
{
    tabSubscription: Subscription;
    closeTabSubscription: Subscription;

    // Admin view templates
    @ViewChild(TabsComponent) tabsComponent;
    @ViewChild('usersTpl') usersTpl;
    @ViewChild('usersExportsTpl') usersExportsTpl;
    @ViewChild('usersPresentationsTpl') usersPresentationsTpl;
    @ViewChild('settingsProfileInfoTpl') settingsProfileInfoTpl;
    @ViewChild('usersProfileTpl') usersProfileTpl;
    @ViewChild('settingsProfileAttributesTpl') settingsProfileAttributesTpl;
    @ViewChild('settingsProfileRatingsTpl') settingsProfileRatingsTpl;
    @ViewChild('scheduleTpl') scheduleTpl;
    @ViewChild('scheduleCalendarTpl') scheduleCalendarTpl;
    @ViewChild('adminShiftListTpl') adminShiftListTpl;
    @ViewChild('shiftsImportTpl') shiftsImportTpl;
    @ViewChild('shiftsExportAsExcelTpl') shiftsExportAsExcelTpl;
    @ViewChild('shiftsExportAsPdfTpl') shiftsExportAsPdfTpl;
    @ViewChild('usersChatTpl') usersChatTpl;
    @ViewChild('adminShiftTpl') adminShiftTpl;
    @ViewChild('newShiftTpl') newShiftTpl;
    @ViewChild('editShiftTpl') editShiftTpl;
    @ViewChild('shiftRoleEditTpl') shiftRoleEditTpl;
    @ViewChild('settingsTpl') settingsTpl;
    @ViewChild('trackingTpl') trackingTpl;
    @ViewChild('adminGenStaffInvoicesTpl') adminGenStaffInvoicesTpl;
    @ViewChild('adminClientInvoiceListTpl') adminClientInvoiceListTpl;
    @ViewChild('adminStaffInvoiceListTpl') adminStaffInvoiceListTpl;

    // Staff view templates
    @ViewChild('staffShiftTpl') staffShiftTpl;

    // Client view templates clientShiftListTpl
    @ViewChild('clientShiftListTpl') clientShiftListTpl;
    @ViewChild('clientNewBookingTpl') clientNewBookingTpl;
    @ViewChild('clientShiftTpl') clientShiftTpl;

    // Form
    @ViewChild('formTpl') formTpl; // Form Template for signing

    // Payroll
    @ViewChild('payrollTpl') payrollTpl;
    @ViewChild('generatePayrollTpl') generatePayrollTpl;
    @ViewChild('newMessageTpl') newMessageTpl;

    socketService: SocketService;
    fcmService: FCMService;
    alive: boolean = false;

    socketSubscription: Subscription;

    dialogRef: any;

    userSwitcherSubscription: Subscription;

    formData: any;

    constructor(
        private translationLoader: FuseTranslationLoaderService,
        private fuseNavigationService: FuseNavigationService,
        private tabService: TabService,
        private injector: Injector,
        private tokenStorage: TokenStorage,
        private trackingService: TrackingService,
        private authService: AuthenticationService,
        private dialog: MatDialog,
    ) {

        this.socketService = injector.get(SocketService);
        this.fcmService = injector.get(FCMService);

        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        });

        this.closeTabSubscription = this.tabService.tabClosed.subscribe(url => {
            this.closeTab(url);
        });

        this.formData = this.tokenStorage.getFormData();
    }

    async runSockets() {
        this.socketService.enableReconnect();
        this.socketSubscription = this.socketService.connectionStatus.subscribe((connected: boolean) => {
            if (connected) {
                this.startSocket();
            }
        });
    }

    switchUser() {
        if (this.socketService.getState() === WebSocket.CONNECTING || this.socketService.getState() === WebSocket.OPEN) {
            this.socketService.closeConnection();
        } else {
            this.socketService.reconnect();
        }
        setTimeout(() => {
            this.fuseNavigationService.setNavigationModel(new FuseNavigationModel(this.tokenStorage.getUser().lvl));
            this.addMenuByUserLevel();
            this.addPayRollMenu();
        });
        this.loadFCMservices();
    }

    startSocket() {
        this.socketService.sendData(JSON.stringify({
            type: 'init',
            payload: this.tokenStorage.getUser().id
        }));
    }

    async loadFCMservices() {
        await this.fcmService.requestPermission();
       /**
        * firebase token refreshed
        */
       this.fcmService.refreshToken();
    }

    ngOnInit() {
        this.runSockets();
        this.switchUser();
        this.userSwitcherSubscription = this.tokenStorage.userSwitchListener.subscribe((isSwitch: boolean) => {
            if (isSwitch) {
                this.tabService.openTabs.forEach((tab: TabComponent) => {
                    this.closeTab(tab.url);
                });
                this.switchUser();
            }
        });

        if (window.addEventListener) {
            window.addEventListener('message', this.onMessage.bind(this), false);
        } else if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
        }
    }

    ngOnDestroy() {
        this.socketSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.closeTabSubscription.unsubscribe();
        this.userSwitcherSubscription.unsubscribe();
    }

    openTab(tab: Tab) {
        const _tab = {
            ...tab,
            template: this[tab.template]
        };

        this.tabsComponent.openTab(_tab);

        if (_tab.url === 'tracking') {
            const trackingCategory = _tab.data;
            if (JSON.stringify(_tab.data) != '{}' ){
                this.trackingService.toggleSelectedCategory(trackingCategory as TrackingCategory);
            }
        }
    }

    closeTab(url: string) {
        if (!url) { return false; }
        this.tabsComponent.closeTabByURL(url);
    }

    private addMenuByUserLevel() {
        const level = this.tokenStorage.getUser().lvl;
        const navModel = this.fuseNavigationService.getNavigationModel();

        switch (level) {
            case 'client':

                // Add dialog to menu
                const exportShiftMenu = navModel[0].children[2];

                // Excel Spreadsheet
                if (_.findIndex(exportShiftMenu.children, ['id', 'excel_spreadsheet']) < 0) {
                    exportShiftMenu.children.push(
                        {
                            'id': 'excel_spreadsheet',
                            'title': 'Excel Spreadsheet',
                            'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET',
                            'type': 'item',
                            'function': () => {
                                this.dialogRef = this.dialog.open(ShiftsExportAsExcelDialogComponent, {
                                    panelClass: 'client-shifts-export-as-excel-dialog',
                                });

                                this.dialogRef.afterClosed().subscribe(res => {});
                            }
                        },

                    );
                }

                // PDF
                if (_.findIndex(exportShiftMenu.children, ['id', 'pdf_overview']) < 0) {
                    exportShiftMenu.children.push(
                        {
                            'id': 'pdf_overview',
                            'title': 'PDF Overview',
                            'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW',
                            'type': 'item',
                            'function': () => {
                                this.dialogRef = this.dialog.open(ShiftsExportAsPdfDialogComponent, {
                                    panelClass: 'client-shifts-export-as-pdf-dialog',
                                });

                                this.dialogRef.afterClosed().subscribe(res => { });
                            }
                        },

                    );
                }
                break;

            case 'admin':
            case 'owner':

                // Add Users/Export Dialog
                const usersMenu = navModel[0];
                if (_.findIndex(usersMenu.children, ['id', 'export']) < 0) {
                    usersMenu.children.unshift(
                        {
                            'id': 'export',
                            'title': 'Export',
                            'translate': 'NAV.ADMIN.USERS_EXPORT',
                            'type': 'item',
                            'function': () => {
                                this.dialogRef = this.dialog.open(UsersExportDialogComponent, {
                                    panelClass: 'users-export-dialog',
                                });

                                this.dialogRef.afterClosed().subscribe(res => { });
                            }
                        },
                    );
                }
                break;

            default:
                break;
        }
    }

    private addPayRollMenu() {
        const shouldAddPayroll = this.tokenStorage.getSettings().payroll;
        const level = this.tokenStorage.getUser().lvl;
        if (!shouldAddPayroll || !['owner', 'admin'].includes(level)) { return; }
        const navModel = this.fuseNavigationService.getNavigationModel();
        const payroll = {
            'id': 'payroll',
            'title': 'Payroll',
            'translate': 'NAV.ADMIN.PAYROLL',
            'type': 'collapse',
            'icon': 'payment',
            'tab': new Tab('Payroll', 'payrollTpl', 'payroll', {}),
            children: [
                {
                    'id': 'generate_payroll',
                    'title': 'Generate Payroll',
                    'translate': 'NAV.ADMIN.PAYROLL_GENERATE_PAYROLL',
                    'type': 'item',
                    'tab': new Tab('Generate Payroll', 'generatePayrollTpl', 'payroll/generate', {})
                }
            ]
        };
        navModel.splice(2, 0, payroll);
    }

    onMessage(event: any) {
        if (event.data && event.data.func && this.formData) {
            const index = this.formData.findIndex(data => data.id === this.tabService.currentTab.data.id);
            this.formData.splice(index, 1);
            if (this.formData.length > 0) {
                this.tokenStorage.setFormData(this.formData);
            } else {
                this.tokenStorage.removeFormData();
            }
        }
    }
}
