import { Component, Injector } from '@angular/core';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from './core/services/translation-loader.service';

import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { FuseNavigationModel } from './navigation/navigation.model';
import { locale as navigationEnglish } from './navigation/i18n/en';
import { locale as navigationTurkish } from './navigation/i18n/tr';
import { SocketService } from './shared/services/socket.service';
import { UsersChatService } from './main/content/users/chat/chat.service';
import { FavicoService } from './shared/services/favico.service';
import { ActivityManagerService } from './shared/services/activity-manager.service';
import { TabService } from './main/tab/tab.service';

@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    socketService: SocketService;

    constructor(
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreen: FuseSplashScreenService,
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService,
        private injector: Injector,
        private usersChatService: UsersChatService,
        private favicoService: FavicoService,
        private activityManagerService: ActivityManagerService,
        private tabService: TabService
    )
    {
        // Add languages
        this.translate.addLangs(['en', 'tr']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Use a language
        this.translate.use('en');

        // Set the navigation model
        this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());

        // Set the navigation translations
        this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

        // listen window activity/inactivity change
        this.activityManagerService.detectActivityChange();

        this.socketService = this.injector.get(SocketService);

        this.listenSocketMessage();
    }

    listenSocketMessage() {
        this.socketService.webSocketData.subscribe(res => {
            if (!res || !res.data) return;
            const payload = JSON.parse(res.data);
            if (this.tabService.currentTab && this.tabService.currentTab.url === 'users/chat') {
                this.usersChatService.currentMessage.next(payload);
            }
            if (!this.activityManagerService.isFocused || !this.tabService.currentTab || this.tabService.currentTab.url !== 'users/chat') {
                if (payload.type === 'newMessage') {
                    this.updateUnreadList([payload.data]);
                }
                if (payload.type === 'newThread') {
                    this.updateUnreadThread(parseInt(payload.data));
                }
            }
        });
    }

    updateUnreadList(newList: any) {
        this.usersChatService.unreadList = [...this.usersChatService.unreadList, ...newList];
        if (this.usersChatService.unreadList.length > 0) {
            this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
        }
    }

    updateUnreadThread(newThreadId: number) {
        this.usersChatService.unreadThreads.push(newThreadId);
        if (this.usersChatService.unreadThreads.length > 0) {
            this.favicoService.setBadge(this.usersChatService.unreadList.length + this.usersChatService.unreadThreads.length);
        }
    }
}
