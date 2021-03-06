import { Component, ViewChild, OnInit, OnDestroy, Injector, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment-timezone';

import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { FuseNavigationService } from '../../../core/components/navigation/navigation.service';
import { FuseNavigationModel } from '../../../navigation/navigation.model';
import { AuthenticationService } from '../../../shared/services/authentication.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { TabsComponent } from '../../tab/tabs/tabs.component';
import { Tab } from '../../tab/tab';
import { TabService } from '../../tab/tab.service';

import { TAB } from '../../../constants/tab';
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
import { AdminExportAsExcelDialogComponent } from '../schedule/shifts-export/admin/export-as-excel-dialog/export-as-excel-dialog.component';
import { AdminExportAsPdfDialogComponent } from '../schedule/shifts-export/admin/export-as-pdf-dialog/export-as-pdf-dialog.component';
import { UserService } from '../users/user.service';
import { SetUserTimezoneDialogComponent } from './set-user-timezone-dialog/set-user-timezone-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ConnectorService } from '../../../shared/services/connector.service';
import { SettingsService } from '../settings/settings.service';
import { QuizComponent } from '../quiz/quiz.component';
import { FormComponent } from '../form-sign/form/form.component';
import { ShowcaseComponent } from '../showcase/showcase.component';
import { ShowcaseService } from '../showcase/showcase.service';

@Component({
    selector: 'fuse-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class FuseHomeComponent implements OnInit, OnDestroy {

    tabSubscription: Subscription;
    closeTabSubscription: Subscription;
    quizsEnableSubscription: Subscription;
    surveysEnableSubscription: Subscription;
    schedulingEnableSubscription: Subscription;

    // Admin view templates
    @ViewChild(TabsComponent) tabsComponent: TabsComponent;
    @ViewChild('usersTpl') usersTpl;
    @ViewChild('cardsTpl') cardsTpl;
    @ViewChild('presentationsTpl') presentationsTpl;
    @ViewChild('usersExportsTpl') usersExportsTpl;
    @ViewChild('usersProfileTpl') usersProfileTpl;
    @ViewChild('scheduleTpl') scheduleTpl;
    @ViewChild('scheduleCalendarTpl') scheduleCalendarTpl;
    @ViewChild('adminShiftListTpl') adminShiftListTpl;
    @ViewChild('adminShiftGroupTpl') adminShiftGroupTpl;
    @ViewChild('shiftsImportTpl') shiftsImportTpl;
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
    @ViewChild('columnMappingTpl') columnMappingTpl;
    @ViewChild('importHistoryTpl') importHistoryTpl;

    // Staff view templates
    @ViewChild('staffShiftTpl') staffShiftTpl;

    // Client view templates clientShiftListTpl
    @ViewChild('clientShiftListTpl') clientShiftListTpl;
    @ViewChild('clientNewBookingTpl') clientNewBookingTpl;

    // Form
    @ViewChild('formTpl') formTpl; // Form Template for signing
    @ViewChild('quizTpl') quizTpl; // Form Template for adding new quizzes
    @ViewChild('showcaseTpl') showcaseTpl;

    @ViewChild('quizsTpl') quizsTpl; // Quizs tab
    @ViewChild('surveysTpl') surveysTpl; // Surveys tab

    // Payroll
    @ViewChild('payrollTpl') payrollTpl;
    @ViewChild('generatePayrollTpl') generatePayrollTpl;

    @ViewChild('newMessageTpl') newMessageTpl;
    @ViewChild('emailTemplatesTpl') emailTemplatesTpl;
    @ViewChild('payrollDetailTpl') payrollDetailTpl;

    @ViewChild('clientsTpl') clientsTpl;
    @ViewChild('outsourceCompaniesTpl') outsourceCompaniesTpl;

    @ViewChild('clientInvoicesTpl') clientInvoicesTpl;
    @ViewChild('clientInvoicesDetailTpl') clientInvoicesDetailTpl;
    @ViewChild('clientInvoiceGenerateTpl') clientInvoiceGenerateTpl;

    @ViewChild('reportsUploadsTpl') reportsUploadsTpl;
    @ViewChild('billingTpl') billingTpl;
    @ViewChild('summaryTpl') summaryTpl;
    @ViewChild('groupCopyTpl') groupCopyTpl;

    @ViewChildren('homeForm') homeForms: QueryList<FormComponent>;

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
        private userService: UserService,
        private toastr: ToastrService,
        private connectorService: ConnectorService,
        private settingsService: SettingsService,
        private showcaseService: ShowcaseService
    ) {

        this.socketService = this.injector.get(SocketService);
        this.fcmService = this.injector.get(FCMService);

        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        });

        this.closeTabSubscription = this.tabService.tabClosed.subscribe(url => {
            this.closeTab(url);
        });

        this.quizsEnableSubscription = this.settingsService.quizsEnableChanged.subscribe(value => {
            const settings = this.tokenStorage.getSettings();
            settings.quiz_enable = value;
            this.tokenStorage.setSettings(settings);
            this.refreshMenu();
        });

        this.surveysEnableSubscription = this.settingsService.surveysEnableChanged.subscribe(value => {
            const settings = this.tokenStorage.getSettings();
            settings.survey_enable = value;
            this.tokenStorage.setSettings(settings);
            this.refreshMenu();
        });

        this.schedulingEnableSubscription = this.settingsService.schedulingEnableChanged.subscribe(value => {
            const settings = this.tokenStorage.getSettings();
            settings.shift_enable = value;
            this.tokenStorage.setSettings(settings);
            this.refreshMenu();
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
            this.refreshMenu();
        });
        if (!this.tokenStorage.isExistSecondaryUser()) {
            this.loadFCMservices();
        }
    }

    startSocket() {
        this.socketService.sendData({
            type: 'init',
            payload: this.tokenStorage.getUser().id
        });
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
        this.userSwitcherSubscription = this.tokenStorage.userSwitchListener.subscribe(async (isSwitch: boolean) => {
            if (isSwitch) {
                for (let i = this.tabService.openTabs.length - 1; i >= 0; i--) {
                    this.closeTab(this.tabService.openTabs[i].url);
                }
                try {
                    const formconnect = await this.connectorService.fetchConnectorData('formconnect');
                    this.authService.saveConnectData({ formconnect });
                } catch (e) { }

                try {
                    const quizconnect = await this.connectorService.fetchConnectorData('quizconnect');
                    this.authService.saveConnectData({ quizconnect });
                } catch (e) { }

                this.switchUser();
            }
        });
        if (window.addEventListener) {
            window.addEventListener('message', this.onMessage.bind(this), false);
        } else if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
        }

        // Detect timezone
        this.setTimezone();

        this.handleURLParams();

        if ('serviceWorker' in navigator) {
            // ensure service worker is ready
            /* never seems to be ready!!
            navigator.serviceWorker.ready.then(function (reg) {
                // listening for messages from service worker
                console.log('sw ready');
                navigator.serviceWorker.addEventListener('message', function (event) {
                    var messageFromSW = event.data;
                    console.log("message from SW: " + messageFromSW);
                });
            });*/
            setTimeout(() => {
                navigator.serviceWorker.addEventListener('message', (event) => {
                    var messageFromSW = event.data;
                    console.log("message from SW: " + messageFromSW);
                });
            }, 3000);
        }
    }

    async setTimezone() {
        const user = this.tokenStorage.getUser();
        const tz = moment.tz.guess();
        if (user && user.php_tz !== tz) {
            try {
                const timezones = await this.userService.getTimezones();
                setTimeout(() => {
                    if (timezones && timezones[tz]) {
                        const dialogRef = this.dialog.open(SetUserTimezoneDialogComponent, {
                            disableClose: false,
                            panelClass: 'set-user-timezone-dialog',
                            data: {
                                timezone: timezones[tz]
                            }
                        });
                        dialogRef.afterClosed().subscribe(async (result) => {
                            if (result) {
                                try {
                                    const res = await this.userService.updateUser(user.id, { php_tz: tz });
                                    user.php_tz = tz;
                                    this.tokenStorage.setUser(user);
                                } catch (e) {
                                    this.toastr.error(e.message || 'Something is wrong!');
                                }
                            }
                        });
                    }
                }, 1500);
            } catch (e) { }
        }
    }

    ngOnDestroy() {
        this.socketSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.closeTabSubscription.unsubscribe();
        this.userSwitcherSubscription.unsubscribe();
        this.quizsEnableSubscription.unsubscribe();
        this.surveysEnableSubscription.unsubscribe();
        this.schedulingEnableSubscription.unsubscribe();
    }

    openTab(tab: Tab) {
        const _tab = {
            ...tab,
            template: this[tab.template]
        };

        this.tabsComponent.openTab(_tab);

        if (_tab.url === 'tracking') {
            const trackingCategory = _tab.data;
            if (JSON.stringify(_tab.data) !== '{}') {
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

                                this.dialogRef.afterClosed().subscribe(res => { });
                            }
                        },

                    );
                }

                // PDF
                if (_.findIndex(exportShiftMenu.children, ['id', 'printable_overview']) < 0) {
                    exportShiftMenu.children.push(
                        {
                            'id': 'printable_overview',
                            'title': 'Printable Overview',
                            'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_PRINTABLE_OVERVIEW',
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

                const scheduleMenu = navModel.find(m => m.id === 'schedule');
                if (scheduleMenu) {
                    const exportShiftMenu = scheduleMenu.children.find(m => m.id === 'export_shifts');
                    if (exportShiftMenu) {

                        // Excel Spreadsheet
                        if (_.findIndex(exportShiftMenu.children, ['id', 'excel_spreadsheet']) < 0) {
                            exportShiftMenu.children.push(
                                {
                                    'id': 'excel_spreadsheet',
                                    'title': 'Excel Spreadsheet',
                                    'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET',
                                    'type': 'item',
                                    'function': () => {
                                        this.dialogRef = this.dialog.open(AdminExportAsExcelDialogComponent, {
                                            panelClass: 'admin-shift-exports-as-excel-dialog',
                                            disableClose: false,
                                            data: {}
                                        });

                                        this.dialogRef.afterClosed().subscribe(res => { });
                                    }
                                },

                            );
                        }

                        // PDF
                        if (_.findIndex(exportShiftMenu.children, ['id', 'printable_overview']) < 0) {
                            exportShiftMenu.children.push(
                                {
                                    'id': 'printable_overview',
                                    'title': 'Printable Overview',
                                    'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_PRINTABLE_OVERVIEW',
                                    'type': 'item',
                                    'function': () => {
                                        this.dialogRef = this.dialog.open(AdminExportAsPdfDialogComponent, {
                                            panelClass: 'admin-shift-exports-as-pdf-dialog',
                                            disableClose: false,
                                            data: {}
                                        });

                                        this.dialogRef.afterClosed().subscribe(res => { });
                                    }
                                },

                            );
                        }
                    }
                }

                if (level == 'owner') {
                    const settingsMenu = navModel.find(v => v.id == 'settings');
                    if (settingsMenu && !settingsMenu.children.find(v => v.id == 'billing')) {
                        const index = settingsMenu.children.findIndex(v => v.id == 'templates');
                        settingsMenu.children.splice(index, 0, {
                            'id': 'billing',
                            'title': 'Billing',
                            'translate': 'NAV.ADMIN.SETTINGS_BILLING',
                            'type': 'item',
                            'tab': TAB.SETTINGS_BILLING_TAB
                        });
                    }
                }

                break;

            case 'staff':
                const permissions = this.tokenStorage.getPermissions();
                const payMenu: any = {
                    'id': 'invoices',
                    'title': 'Pay',
                    'translate': 'NAV.STAFF.PAY',
                    'type': 'collapse',
                    'icon': 'attach_money',
                    'children': [
                      {
                          'id': 'staff_pay_view',
                          'title': 'View',
                          'translate': 'NAV.STAFF.VIEW',
                          'type': 'item',
                          'tab': TAB.STAFF_INVOICES_TAB
                      }
                    ]
                };
                if (permissions && permissions.staff_invoice) {
                    payMenu.children.push(
                        {
                            'id': 'new_invoice',
                            'title': 'Generate Invoice',
                            'translate': 'NAV.STAFF.NEW_INVOICE',
                            'type': 'item',
                            'tab': TAB.STAFF_NEW_INVOICE_TAB
                        }
                    );
                }
                const index = navModel.findIndex(m => m.id === 'invoices');
                if (index < 0) {
                    navModel.splice(1, 0, payMenu);
                } else {
                    navModel.splice(index, 1, payMenu);
                }
                break;

            default:
                break;
        }
    }

    private addPayRollMenu() {
        var shouldAddPayroll = false;
        const level = this.tokenStorage.getUser().lvl;
        if (level == 'owner') {
            shouldAddPayroll = true;
        } else if (level == 'admin') {
            const permissions = this.tokenStorage.getPermissions();
            if (permissions && permissions.admin_staff_payroll) {
                shouldAddPayroll = true;
            }
        }
        if (!shouldAddPayroll) { return; }
        const navModel = this.fuseNavigationService.getNavigationModel();
        if (navModel.find(v => v.id === 'payroll')) { return; }
        const payroll = {
            'id': 'payroll',
            'title': 'Payroll',
            'translate': 'NAV.ADMIN.PAYROLL',
            'type': 'collapse',
            'icon': 'payment',
            'tab': new Tab('Payroll', 'payrollTpl', 'payroll', {}),
            children: [
                {
                    'id': 'payrolls',
                    'title': 'Payrolls',
                    'translate': 'NAV.ADMIN.PAYROLLS',
                    'type': 'item',
                    'tab': new Tab('Payroll', 'payrollTpl', 'payroll', {}),
                },
                {
                    'id': 'generate_payroll',
                    'title': 'Generate Payroll',
                    'translate': 'NAV.ADMIN.PAYROLL_GENERATE_PAYROLL',
                    'type': 'item',
                    'tab': new Tab('Generate Payroll', 'generatePayrollTpl', 'payroll/generate', {})
                }
            ]
        };
        navModel.splice(4, 0, payroll);
    }

    private refreshMenu() {
        const settings = this.tokenStorage.getSettings();
        const navModel = this.fuseNavigationService.getNavigationModel();
        if (settings.client_enable != 1) {
            let index = navModel.findIndex(v => v.id === 'clients');
            if (index > -1) { navModel.splice(index, 1); }
            index = navModel.findIndex(v => v.id === 'client_invoices');
            if (index > -1) { navModel.splice(index, 1); }
        }
        if (settings.outsource_enable != 1) {
            const index = navModel.findIndex(v => v.id === 'outsource_companies');
            if (index > -1) { navModel.splice(index, 1); }
        }
        if (settings.tracking_enable != 1) {
            const index = navModel.findIndex(v => v.id === 'tracking');
            if (index > -1) { navModel.splice(index, 1); }
        }

        // Users -> Cards 
        const usersNavItem = navModel.find(v => v.id === 'users');
        if (usersNavItem) {
            // Cards
            const index = usersNavItem.children.findIndex(v => v.id === 'cards');
            if (settings.showcase_module != 1) {
                if (index > -1) {
                    usersNavItem.children.splice(index, 1);
                }
            } else {
                if (index < 0) {
                    usersNavItem.children.push(
                        {
                            'id': 'cards',
                            'title': 'Cards',
                            'translate': 'NAV.ADMIN.USERS_CARDS',
                            'type': 'item',
                            'tab': TAB.USERS_CARDS
                        }
                    );
                }
            }
            // Presentations
            const presentationIdx = usersNavItem.children.findIndex(v => v.id === 'presentations');
            if (settings.showcase_module != 1) {
                if (presentationIdx > -1) {
                    usersNavItem.children.splice(presentationIdx, 1);
                }
            } else {
                if (presentationIdx < 0) {
                    usersNavItem.children.push(
                        {
                            'id': 'presentations',
                            'title': 'Presentations',
                            'translate': 'NAV.ADMIN.USERS_PRESENTATIONS',
                            'type': 'item',
                            'tab': TAB.USERS_PRESENTATIONS_TAB

                        }
                    );
                }
            }
        }

        // Reports & Uploads
        const reportsNavItem = navModel.find(v => v.id === 'reports_and_uploads');
        if (reportsNavItem) {
            // quiz menu
            if (settings.quiz_enable == 1) {
                const index = reportsNavItem.children.findIndex(v => v.id === 'quizs');
                if (index < 0) {
                    reportsNavItem.children.unshift(
                        {
                            'id': 'quizs',
                            'title': 'Quizzes',
                            'translate': 'NAV.ADMIN.QUIZS',
                            'type': 'item',
                            'tab': TAB.QUIZS_TAB
                        }
                    );
                }
            } else {
                const index = reportsNavItem.children.findIndex(v => v.id === 'quizs');
                if (index > -1) { reportsNavItem.children.splice(index, 1); }
            }

            // surveys menu
            if (settings.survey_enable == 1) {
                const index = reportsNavItem.children.findIndex(v => v.id === 'surveys');
                if (index < 0) {
                    reportsNavItem.children.push(
                        {
                            'id': 'surveys',
                            'title': 'Surveys',
                            'translate': 'NAV.ADMIN.SURVEYS',
                            'type': 'item',
                            'tab': TAB.SURVEYS_TAB
                        }
                    );
                }
            } else {
                const index = reportsNavItem.children.findIndex(v => v.id === 'surveys');
                if (index > -1) { reportsNavItem.children.splice(index, 1); }
            }
            reportsNavItem.type = reportsNavItem.children.length > 0 ? 'collapse' : 'item';
        }

        const scheduleMenuItem = navModel.find(v => v.id === 'schedule');
        const accountMenuItem = navModel.find(v => v.id === 'accounting');
        if (settings.shift_enable == 1) {
            if (accountMenuItem && !accountMenuItem.visible) {
                accountMenuItem.visible = true;
            }
            if (scheduleMenuItem && !scheduleMenuItem.visible) {
                scheduleMenuItem.visible = true;
            }
        } else {
            if (accountMenuItem && (_.isUndefined(accountMenuItem.visible) || accountMenuItem.visible)) {
                accountMenuItem.visible = false;
            }
            if (scheduleMenuItem && (_.isUndefined(scheduleMenuItem.visible) || scheduleMenuItem.visible)) {
                scheduleMenuItem.visible = false;
            }
        }
        this.fuseNavigationService.setNavigationModel({ model: navModel });
    }

    async onMessage(event: any) {
        if (!event.data) return;
        switch (event.data.type) {
            case 'formconnect':
                const currentFormTab: TabComponent = this.tabService.openTabs.find(tab => tab.url === event.data.tabUrl);
                if (event.data.message === 'tokenError') {
                    try {
                        this.connectorService.formconnectTokenRefreshing$.next(true);
                        const formconnect = await this.connectorService.fetchConnectorData('formconnect');
                        this.authService.saveConnectData({ formconnect });
                    } catch (e) {
                        this.toastr.error(e.error.message);
                    } finally {
                        this.connectorService.formconnectTokenRefreshing$.next(false);
                    }
                } else if (event.data.message === 'loaded') {
                    let formComponent: FormComponent;
                    if (event.data.tabUrl.startsWith('home/form/')) {
                        formComponent = this.homeForms.find((form: FormComponent) => form.url === event.data.tabUrl);
                    } else {
                        formComponent = currentFormTab.template._projectedViews.find(view => view.context.url === event.data.tabUrl).nodes[2].instance;
                    }
                    formComponent.loading = false;
                } else if (event.data.message === 'create') {
                    currentFormTab.title = event.data.payload.name;
                    currentFormTab.url = currentFormTab.url.replace('new', `${event.data.payload.id}/edit`);
                    currentFormTab.data = { ...currentFormTab.data, other_id: event.data.payload.id, isEdit: true };
                } else {
                    if (this.formData) {
                        const index = this.formData.findIndex(data => data.id === this.tabService.currentTab.data.id);
                        this.formData.splice(index, 1);
                        if (this.formData.length > 0) {
                            this.tokenStorage.setFormData(this.formData);
                        } else {
                            this.tokenStorage.removeFormData();
                        }
                        setTimeout(() => {
                            if (this.tabsComponent.tabs.length > 0) {
                                this.tabsComponent.selectTab(this.tabsComponent.tabs.first);
                            }
                        });
                    } else {
                        this.connectorService.currentFormTab$.next(currentFormTab);
                    }
                }
                break;
            case 'quizconnect':
                const currentQuizTab = this.tabService.openTabs.find(tab => tab.url === event.data.tabUrl);
                if (event.data.message === 'tokenError') {
                    try {
                        this.connectorService.quizconnectTokenRefreshing$.next(true);
                        const quizconnect = await this.connectorService.fetchConnectorData('quizconnect');
                        this.authService.saveConnectData({ quizconnect });
                    } catch (e) {
                        this.toastr.error(e.error.message);
                    } finally {
                        this.connectorService.quizconnectTokenRefreshing$.next(false);
                    }
                } else if (event.data.message === 'loaded') {
                    const quizComponent: QuizComponent = currentQuizTab.template._projectedViews.find(view => view.context.url === event.data.tabUrl).nodes[2].instance;
                    quizComponent.loading = false;
                } else if (event.data.message === 'create') {
                    currentQuizTab.title = event.data.payload.name;
                    currentQuizTab.url = currentQuizTab.url.replace('new', `${event.data.payload.id}/edit`);
                    currentQuizTab.data = { ...currentQuizTab.data, other_id: event.data.payload.id, isEdit: true };
                } else {
                    if (event.data.score) {
                        currentQuizTab.data = { ...currentQuizTab.data, score: event.data.score };
                    }
                    this.connectorService.currentQuizTab$.next(currentQuizTab);
                }
                break;
            case 'showcaseconnect':
                const currentShowcaseTab = this.tabService.openTabs.find(tab => tab.url === event.data.tabUrl);
                if (event.data.message === 'tokenError') {
                    try {
                        this.connectorService.showcaseconnectTokenRefresing$.next(true);
                        const showcaseconnect = await this.connectorService.fetchConnectorData('showcaseconnect');
                        this.authService.saveConnectData({ showcaseconnect });
                    } catch (e) {
                        this.toastr.error(e.error.message);
                    } finally {
                        this.connectorService.showcaseconnectTokenRefresing$.next(false);
                    }
                } else if (event.data.message === 'loaded') {
                    const showcaseComponent: ShowcaseComponent = currentShowcaseTab.template._projectedViews.find(view => view.context.url === event.data.tabUrl).nodes[2].instance;
                    showcaseComponent.loading = false;
                } else if (event.data.message === 'create') {
                    const manipulateTab = this.tabService.openTabs.find(tab => tab.url === (event.data.template.type === 'card' ? 'users/cards' : 'users/presentations'));
                    if (manipulateTab) {
                        currentShowcaseTab.data.template = event.data.template;
                        this.connectorService.currentShowcaseTab$.next(currentShowcaseTab);
                    } else {
                        this.tabService.closeTab(event.data.tabUrl);
                        try {
                            const res = await this.showcaseService.getTemplateByOtherId(event.data.template.id);
                            const showcase_template_id = res.data.id;
                            if (event.data.template.type === 'card') {
                                await this.userService.updateCard(event.data.payload.id, { ...event.data.payload, showcase_template_id });
                            } else {
                                await this.userService.savePresentation(event.data.payload.id, { ...event.data.payload, showcase_template_id });
                            }
                        } catch (e) {
                            this.toastr.error(e.error.message);
                        }
                        this.connectorService.currentShowcaseTab$.next(null);
                    }
                } else if (event.data.message === 'edit') {
                    const manipulateTab = this.tabService.openTabs.find(tab => tab.url === (event.data.template.type === 'card' ? 'users/cards' : 'users/presentations'));
                    if (manipulateTab) {
                        currentShowcaseTab.data.template = event.data.template;
                        this.connectorService.currentShowcaseTab$.next(currentShowcaseTab);
                    } else {
                        this.tabService.closeTab(event.data.tabUrl);
                        this.connectorService.currentShowcaseTab$.next(null);
                    }
                }
                break;
        }
    }

    private handleAction(action, id) {
        // Check what kind of action was passed
        const level = this.tokenStorage.getUser().lvl;
        if (action === 'shift') {
            const url = level + `/shift/${id}`;

            /* TODO: Add dynamic shift title by ID */
            const tab = new Tab('Test', 'adminShiftTpl', url, { id, url });
            // this.tabService.openTab(tab);
            this.openTab(tab);

        } else if (action === 'chat') {
            this.openTab(TAB.USERS_CHAT_TAB);

            /* TODO: using tabb service directly does nto work for some reason */
            // this.tabService.openTab(TAB.USERS_TAB);
        }
    }

    /**
     * This function handles any actions provided query params in url, handles opening initial window when coming from notification
     **/
    private handleURLParams() {
        const action = this.getUrlParameter('action');
        const id = this.getUrlParameter('id');
        this.handleAction(action, id);
    }

    private getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}
