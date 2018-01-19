import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { AuthenticationService } from '../../../shared/authentication/authentication.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { TabsComponent } from '../../tab/tabs/tabs.component';
import { Tab } from '../../tab/tab';
import { TabService } from '../../tab/tab.service';

import { SETTINGS_PROFILE_INFO_TAB } from '../../../constants/tab';


@Component({
    selector   : 'fuse-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class FuseHomeComponent implements OnDestroy
{
    @ViewChild(TabsComponent) tabsComponent;
    @ViewChild('usersTpl') usersTpl;
    @ViewChild('usersExportsTpl') usersExportsTpl;
    @ViewChild('usersPresentationsTpl') usersPresentationsTpl;
    @ViewChild('settingsProfileInfoTpl') settingsProfileInfoTpl;

    tabSubscription: Subscription;
    constructor(
        private translationLoader: FuseTranslationLoaderService,
        private tabService: TabService,
        private authService: AuthenticationService) {
        this.authService.refreshToken().subscribe(_ => {});
        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        })
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
        const usersTab = new Tab('Users', 'usersTpl', {}, false);
        this.openTab(usersTab);
    }

    openExports() {
        const exportsTab = new Tab('Exports', 'usersExportsTpl', {}, false);
        this.openTab(exportsTab);
    }
    openPresentations() {
        const presentationsTab = new Tab('Presentations', 'usersPresentationsTpl', {}, false);
        this.openTab(presentationsTab);
    }

    openSettingsProfileInfo() {
        this.openTab(SETTINGS_PROFILE_INFO_TAB);
    }

}
