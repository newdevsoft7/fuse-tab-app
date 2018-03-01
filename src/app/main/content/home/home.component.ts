import { Component, ViewChild, OnDestroy } from '@angular/core';
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
import { ActivityManagerService } from '../../../shared/services/activity-manager.service';
import { UsersChatService } from '../users/chat/chat.service';
import { FavicoService } from '../../../shared/services/favico.service';

@Component({
    selector   : 'fuse-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class FuseHomeComponent implements OnDestroy
{
    tabSubscription: Subscription;
    closeTabSubscription: Subscription;
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
    @ViewChild('usersChatTpl') usersChatTpl;
    @ViewChild('adminShiftTpl') adminShiftTpl;
    @ViewChild('newShiftTpl') newShiftTpl;
    @ViewChild('shiftRoleEditTpl') shiftRoleEditTpl;
    @ViewChild('settingsTpl') settingsTpl;
    @ViewChild('trackingTpl') trackingTpl;

    constructor(
        private translationLoader: FuseTranslationLoaderService,
        private fuseNavigationService: FuseNavigationService,
        private tabService: TabService,
        private fcmService: FCMService,
        private socketService: SocketService,
        private tokenStorage: TokenStorage,
        private trackingService: TrackingService,
        private authService: AuthenticationService,
        private activityManagerService: ActivityManagerService,
        private usersChatService: UsersChatService,
        private favicoService: FavicoService) {
        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        });

        this.closeTabSubscription = this.tabService.tabClosed.subscribe(url => {
            this.closeTab(url);
        });

        this.loadFCMservices();
        this.runSockets();

        // listen window activity/inactivity change
        this.activityManagerService.detectActivityChange();

        // this.getUnreads();

        this.fuseNavigationService.setNavigationModel(new FuseNavigationModel(tokenStorage.getUser().lvl))
    }

    async runSockets() {
        this.socketService.connectionStatus.subscribe((connected: boolean) => {
            if (connected) {
                this.startSocket();
            }
        });

        // listen data from web socket server
        this.socketService.listenData();

        this.socketService.webSocketData.subscribe(res => {
            if (!res || !res.data) return;
            const payload = JSON.parse(res.data);
            if (this.tabService.currentTab && this.tabService.currentTab.url === 'users/chat') {
                this.usersChatService.currentMessage.next(payload);
                this.usersChatService.currentMessage.complete();
            }
            if (!this.activityManagerService.isFocused || !this.tabService.currentTab || this.tabService.currentTab.url !== 'users/chat') {
                if (payload.type === 'newMessage') {
                    this.updateUnreadList([payload.data]);
                }
            }
        });
    }

    startSocket() {
        this.socketService.sendData(JSON.stringify({
            type: 'init',
            payload: this.tokenStorage.getUser().id
        }));
    }

    async getUnreads(): Promise<any> {
        try {
            const res = await this.usersChatService.getUnreadMessages();
            this.usersChatService.unreadList = [...this.usersChatService.unreadList, ...res];
            if (this.usersChatService.unreadList.length > 0) {
                this.favicoService.setBadge(this.usersChatService.unreadList.length);
            }
        } catch (e) {
            await Promise.reject(e);
        }
    }

    updateUnreadList(newList: any) {
        this.usersChatService.unreadList = [...this.usersChatService.unreadList, ...newList];
        if (this.usersChatService.unreadList.length > 0) {
            this.favicoService.setBadge(this.usersChatService.unreadList.length);
        }
    }

    async loadFCMservices() {
        await this.fcmService.requestPermission();
       /**
        * firebase token refreshed
        */
       this.fcmService.refreshToken();
    }

    ngOnDestroy() {
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
