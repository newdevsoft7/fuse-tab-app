import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { TabsComponent } from '../../tab/tabs/tabs.component';
import { Tab } from '../../tab/tab';
import { TabService } from '../../tab/tab.service';

@Component({
    selector   : 'fuse-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class FuseHomeComponent
{
    @ViewChild(TabsComponent) tabsComponent;
    @ViewChild('aboutTpl') aboutTpl;
    @ViewChild('usersTpl') usersTpl;
    @ViewChild('exportsTpl') exportsTpl;
    @ViewChild('presentationsTpl') presentationsTpl;

    tabSubscription: Subscription;
    constructor(private translationLoader: FuseTranslationLoaderService, private tabService: TabService)
    {
        this.translationLoader.loadTranslations(english, turkish);
        this.tabSubscription = this.tabService.tab$.subscribe(tab => {
            this.openTab(tab);
        })
    }

    openTab(tab: Tab) {
        const _tab = {
            ...tab,
            template: this[tab.template]
        };
        this.tabsComponent.openTab(_tab);
    }

    openAbout() {
        const aboutTab = new Tab('About', 'aboutTpl', {}, true);
        this.openTab(aboutTab);
    }

    openUsers() {
        const usersTab = new Tab('Users', 'usersTpl', {}, false);
        this.openTab(usersTab);
    }

    openExports() {
        const exportsTab = new Tab('Exports', 'exportsTpl', {}, false);
        this.openTab(exportsTab);
    }
    openPresentations() {
        const presentationsTab = new Tab('Presentations', 'presentationsTpl', {}, false);
        this.openTab(presentationsTab);
    }

}
