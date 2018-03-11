import { Component, ViewChild, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

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
    @ViewChild('usersChatTpl') usersChatTpl;
    @ViewChild('adminShiftTpl') adminShiftTpl;
    @ViewChild('newShiftTpl') newShiftTpl;
    @ViewChild('editShiftTpl') editShiftTpl;
    @ViewChild('shiftRoleEditTpl') shiftRoleEditTpl;
    @ViewChild('settingsTpl') settingsTpl;
    @ViewChild('trackingTpl') trackingTpl;
    @ViewChild('adminGenStaffInvoicesTpl') adminGenStaffInvoicesTpl;
    
    // Staff view templates
    @ViewChild('staffShiftTpl') staffShiftTpl;

    // Client view templates clientShiftListTpl
    @ViewChild('clientShiftListTpl') clientShiftListTpl; 
    @ViewChild('clientNewBookingTpl') clientNewBookingTpl;
    @ViewChild('clientShiftTpl') clientShiftTpl;

    socketService: SocketService;
    fcmService: FCMService;
    alive: boolean = false;

    socketSubscription: Subscription;

    constructor(
        private translationLoader: FuseTranslationLoaderService,
        private fuseNavigationService: FuseNavigationService,
        private tabService: TabService,
        private injector: Injector,
        private tokenStorage: TokenStorage,
        private trackingService: TrackingService,
        private authService: AuthenticationService) {

        this.socketService = injector.get(SocketService);
        this.fcmService = injector.get(FCMService);

        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        });

        this.closeTabSubscription = this.tabService.tabClosed.subscribe(url => {
            this.closeTab(url);
        });

        this.loadFCMservices();

        this.fuseNavigationService.setNavigationModel(new FuseNavigationModel(tokenStorage.getUser().lvl))
    }

    async runSockets() {
        this.socketService.enableReconnect();
        this.socketSubscription = this.socketService.connectionStatus.skipWhile(() => !this.alive).subscribe((connected: boolean) => {
            if (connected) {
                this.startSocket();
            }
        });
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
        this.alive = true;
    }

    ngOnDestroy() {
        this.alive = false;
        this.socketSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.closeTabSubscription.unsubscribe();
    }

    openTab(tab: Tab) {
        const _tab = {
            ...tab,
            template: this[tab.template]
        };

        this.tabsComponent.openTab(_tab);

        if (_tab.url == 'tracking') {
            let trackingCategory = _tab.data;
            if (JSON.stringify(_tab.data) != '{}' ){
                this.trackingService.toggleSelectedCategory(trackingCategory as TrackingCategory);
            }
        }
    }

    closeTab(url: string) {
        if (!url) { return false; }
        this.tabsComponent.closeTabByURL(url);
    }

}
