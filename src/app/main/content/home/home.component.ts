import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { AuthenticationService } from '../../../shared/authentication/authentication.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { TabsComponent } from '../../tab/tabs/tabs.component';
import { Tab } from '../../tab/tab';
import { TabService } from '../../tab/tab.service';

import * as TAB from '../../../constants/tab';



@Component({
    selector   : 'fuse-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class FuseHomeComponent implements OnDestroy
{
    tabSubscription: Subscription;
    @ViewChild(TabsComponent) tabsComponent;
    @ViewChild('usersTpl') usersTpl;
    @ViewChild('usersExportsTpl') usersExportsTpl;
    @ViewChild('usersPresentationsTpl') usersPresentationsTpl;
    @ViewChild('settingsProfileInfoTpl') settingsProfileInfoTpl;
    @ViewChild('usersProfileTpl') usersProfileTpl;
    @ViewChild('scheduleTpl') scheduleTpl;
    @ViewChild('scheduleCalendarTpl') scheduleCalendarTpl;

    constructor(
        private translationLoader: FuseTranslationLoaderService,
        private tabService: TabService,
        private authService: AuthenticationService) {
        this.authService.refreshToken().subscribe(_ => {});
        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        });
    }

    ngOnDestroy() {
        this.tabSubscription.unsubscribe();
    }

    openTab(tab: Tab) {
        const _tab = {
            ...tab,
            template: this[tab.template]
        };
        this.tabsComponent.openTab(_tab);
    }

    openUsers() {
        this.openTab(TAB.USERS_TAB);
    }

    openExports() {
        this.openTab(TAB.USERS_EXPORTS_TAB);
    }
    openPresentations() {
        this.openTab(TAB.USERS_PRESENTATIONS_TAB);
    }

    openSettingsProfileInfo() {
        this.openTab(TAB.SETTINGS_PROFILE_INFO_TAB);
    }

}
