import { Component, ContentChildren, QueryList, AfterContentInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { DynamicTabsDirective } from '../dynamic-tabs.directive';
import { Tab } from '../tab';
import { TabService } from '../tab.service';


@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TabsComponent implements AfterContentInit {
	dynamicTabs: TabComponent[] = [];

	@ContentChildren(TabComponent)
	tabs: QueryList<TabComponent>;

	@ViewChild(DynamicTabsDirective)
	dynamicTabPlaceholder: DynamicTabsDirective;


	constructor(private _componentFactoryResolver: ComponentFactoryResolver, private tabService: TabService) {
	}

	ngAfterContentInit() {
		// get all active tabs
		let activeTabs = this.tabs.filter((tab) => tab.active);

		// if there is no active tab set, activate the first
		if (activeTabs.length === 0) {
			this.selectTab(this.tabs.first);
		}
	}



	openTab(newTab: Tab) {
		const existedTab = this.dynamicTabs.find(tab => tab.title == newTab.title);
		if (existedTab && !newTab.shouldAlwaysOpen) {
			this.selectTab(existedTab);
		} else {
			// get a component factory for our TabComponent
			let componentFactory = this._componentFactoryResolver.resolveComponentFactory(TabComponent);

			// fetch the view container reference from our anchor directive
			let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

			// alternatively...
			// let viewContainerRef = this.dynamicTabPlaceholder;

			// create a component instance
			let componentRef = viewContainerRef.createComponent(componentFactory);

			// set the according properties on our component instance
			let instance: TabComponent = componentRef.instance as TabComponent;
			instance.title = newTab.title;
			instance.template = newTab.template;
			instance.data = newTab.data;

			// remember the dynamic component for rendering the
			// tab navigation headers
			this.dynamicTabs.push(componentRef.instance as TabComponent);

			// set it active
			this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
		}
	}

	selectTab(tab: TabComponent) {
		// deactivate all tabs
		this.tabs.toArray().forEach(tab => tab.active = false);
		this.dynamicTabs.forEach(tab => tab.active = false);

		// activate the tab the user has clicked on.
		tab.active = true;
	}

	closeTab(tab: TabComponent) {
		for (let i = 0; i < this.dynamicTabs.length; i++) {
			if (this.dynamicTabs[i] === tab) {
				// remove the tab from our array
				this.dynamicTabs.splice(i, 1);

				// destroy our dynamically created component again
				let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
				// let viewContainerRef = this.dynamicTabPlaceholder;
				viewContainerRef.remove(i);

				// set tab index to 1st one
				if (i > 0) {
					this.selectTab(this.dynamicTabs[i - 1]);
				} else {
					this.selectTab(this.tabs.last);
				}
				break;
			}
		}
	}

	closeActiveTab() {
		let activeTabs = this.dynamicTabs.filter((tab) => tab.active);
		if (activeTabs.length > 0) {
			// close the 1st active tab (should only be one at a time)
			this.closeTab(activeTabs[0]);
		}
	}

}
