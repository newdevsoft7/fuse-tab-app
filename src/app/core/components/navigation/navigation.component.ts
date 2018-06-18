import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FuseNavigationService } from './navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { TabService } from '../../../main/tab/tab.service';
import { TrackingService } from '../../../main/content/tracking/tracking.service';
import { TrackingCategory } from '../../../main/content/tracking/tracking.models';
import { Tab } from '../../../main/tab/tab';
import { TokenStorage } from '../../../shared/services/token-storage.service';
import * as _ from 'lodash';

@Component({
    selector     : 'fuse-navigation',
    templateUrl  : './navigation.component.html',
    styleUrls    : ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavigationComponent implements OnDestroy
{
    navigationModel: any[];
    private navigationModelChangeSubscription: Subscription;
    private tabSubscription: Subscription;
    private onSelectedCategoryChanged: Subscription;
    private onCategoriesChanged: Subscription;

    trackingCategories: TrackingCategory[];

    @Input('layout') layout = 'vertical';

    constructor(
        private fuseNavigationService: FuseNavigationService,
        private tabService: TabService,
        private trackingService: TrackingService,
        private tokenStorage: TokenStorage
    )
    {
        this.navigationModelChangeSubscription =
            this.fuseNavigationService.onNavigationModelChange
                .subscribe((navigationModel) => {
                    if (navigationModel) {
                        this.navigationModel = navigationModel.filter(f => _.isUndefined(f.visible) || f.visible);
                        this.getTrackingCategories();
                    }
                });

        this.tabSubscription = 
            this.tabService.tab$.subscribe(tab => {
                this.updateNavItemActive(this.navigationModel, tab);
            });

        this.onCategoriesChanged = this.trackingService.getCategories().subscribe(
            categeories => {
                this.addTrackingCategoriesToMenu(categeories);
            });

        this.onSelectedCategoryChanged = this.trackingService.getSelectedCategory().subscribe(
            category => {
                let trackingNav = this.navigationModel.find(n => n.id == 'tracking');
                let tab = trackingNav.children.find ( t => t.id == category.id );
                if (tab) this.updateNavItemActive(trackingNav.children, tab.tab);
            });
    }

    updateNavItemActive(items, tab) {
        const _that = this;
        items.forEach(item => {
            item.active = item.tab == tab ? true : false;
            if (item.children) {
                _that.updateNavItemActive(item.children, tab);
            }
        });
    }

    ngOnDestroy()
    {
        this.navigationModelChangeSubscription.unsubscribe();
        this.tabSubscription.unsubscribe();
        this.onSelectedCategoryChanged.unsubscribe();
        this.onCategoriesChanged.unsubscribe();
    }

    getTrackingCategories() {
        const categories = this.tokenStorage.getSettings().tracking;
        this.trackingService.toggleCategories(categories);
    }

    addTrackingCategoriesToMenu(trackingCategories: TrackingCategory[]) {
        let trackingNav = this.navigationModel.find(n => n.id == 'tracking');
        if (trackingNav) {
            trackingNav.children = [];
            trackingCategories.forEach( category => {
                let navigation:any = {};
                navigation.id = category.id;
                navigation.title = category.cname;
                navigation.type = 'item';
                const tab = new Tab(`Tracking`, 'trackingTpl', `tracking`, { ...category });
                navigation.tab = tab;
    
                trackingNav.children.push(navigation);
            });
        }
    }

}
