import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Tab } from './tab';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TabComponent } from './tab/tab.component';

@Injectable()
export class TabService {
    private tab: Subject<Tab> = new Subject();
    tabActived: BehaviorSubject<TabComponent> = new BehaviorSubject(null);
    currentTab: TabComponent;
    
    tabClosed: Subject<string> = new Subject();
    
    constructor() { }

    openTab(newTab: Tab) {
        this.tab.next(newTab);
    }

    closeTab(url: string) {
        this.tabClosed.next(url);
    }

    get tab$(): Observable<Tab> {
        return this.tab.asObservable();
    }
}
