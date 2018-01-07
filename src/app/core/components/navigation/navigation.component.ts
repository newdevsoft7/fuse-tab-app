import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FuseNavigationService } from './navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { TabService } from '../../../main/tab/tab.service';

@Component({
    selector     : 'fuse-navigation',
    templateUrl  : './navigation.component.html',
    styleUrls    : ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavigationComponent implements OnDestroy
{
    navigationModel: any[];
    navigationModelChangeSubscription: Subscription;

    @Input('layout') layout = 'vertical';

    constructor(
        private fuseNavigationService: FuseNavigationService,
        private tabService: TabService
    )
    {
        this.navigationModelChangeSubscription =
            this.fuseNavigationService.onNavigationModelChange
                .subscribe((navigationModel) => {
                    this.navigationModel = navigationModel;
                });
        
        this.tabService.tab$.subscribe(tab => {
            this.updateNavItemActive(this.navigationModel, tab);
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
    }

}
