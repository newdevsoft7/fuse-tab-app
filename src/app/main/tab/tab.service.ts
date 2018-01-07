import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Tab } from './tab';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TabService {
	private tab: Subject<Tab> = new Subject();
    
    constructor() { }

    openTab(newTab: Tab) {
        this.tab.next(newTab);
    }

    get tab$(): Observable<Tab> {
        return this.tab.asObservable();
    }
}
