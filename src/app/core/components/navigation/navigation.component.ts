import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FuseNavigationService } from './navigation.service';
import { Subscription } from 'rxjs/Subscription';
import { TabService } from '../../../main/tab/tab.service';
import { TrackingService } from '../../../main/content/tracking/tracking.service';
import { TrackingCategory } from '../../../main/content/tracking/tracking.models';
import { Tab } from '../../../main/tab/tab';
import { TokenStorage } from '../../../shared/services/token-storage.service';
import * as _ from 'lodash';
import { TabComponent } from '@main/tab/tab/tab.component';

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
  private selectedTabSubscription: Subscription;
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

    this.selectedTabSubscription = this.tabService.tabActived.subscribe((tab: TabComponent) => {
      if (this.navigationModel && tab) {
        this.updateNavItemActive(this.navigationModel, tab);
      }
    });


    this.onCategoriesChanged = this.trackingService.getCategories().subscribe(
      categeories => {
        this.addTrackingCategoriesToMenu(categeories);
      });
  }

  updateNavItemActive(items, tab: TabComponent) {
    items.forEach(item => {
      if (item.children) {
        item.active = false;
        this.updateNavItemActive(item.children, tab);
      } else {
        if (item.tab && tab && tab.url) {
          if (tab.multiple) {
            item.active = tab.url.substring(0, tab.url.lastIndexOf('/')) === item.tab.url ? true : false
          } else {
            item.active = tab.url === item.tab.url ? true : false;
          }
        } else {
          item.active = false;
        }
      }
    });
  }

  ngOnDestroy()
  {
    this.navigationModelChangeSubscription.unsubscribe();
    this.tabSubscription.unsubscribe();
    this.selectedTabSubscription.unsubscribe();
    this.onCategoriesChanged.unsubscribe();

  }

  getTrackingCategories() {
    const categories = this.tokenStorage.getSettings().tracking;
    this.trackingService.toggleCategories(categories);
  }

  addTrackingCategoriesToMenu(trackingCategories: TrackingCategory[]) {
    if (!trackingCategories || trackingCategories.length ===  0) {
      const idx = this.navigationModel.findIndex(m => m.id === 'tracking');
      if (idx > -1) {
        this.navigationModel.splice(idx, 1);
      }
    } else {
      let trackingNav = this.navigationModel.find(n => n.id === 'tracking');
      if (!trackingNav) {
        trackingNav = {
          'id': 'tracking',
          'title': 'Tracking',
          'translate': 'NAV.ADMIN.TRACKING',
          'type': 'collapse',
          'icon': 'dashboard'
        };
        const reportsIndex = this.navigationModel.findIndex(n => n.id === 'reports_and_uploads');
        if (reportsIndex > -1) {
          this.navigationModel.splice(reportsIndex + 1, 0, trackingNav);
        }
      }
      trackingNav.children = [];
      trackingCategories.forEach( (category, index) => {
        const navigation: any = {};
        navigation.id = category.id;
        navigation.title = category.cname;
        navigation.type = 'item';
        const tab = new Tab(`Tracking`, 'trackingTpl', `tracking/${index}`, { ...category });
        navigation.tab = tab;
        trackingNav.children.push(navigation);
      });
    }

  }

}
