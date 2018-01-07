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
    @ViewChild('aboutTemplate') aboutTemplate;
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

    onOpenAbout() {
        const aboutTab = new Tab('About', 'aboutTemplate', {}, true);
        this.openTab(aboutTab);
    }

}
