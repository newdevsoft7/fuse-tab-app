import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomLoadingService {

    private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() { }

    show() {
        this.loading.next(true);
    }

    hide() {
        this.loading.next(false);
    }

    get isLoading(): Observable<boolean> {
        return this.loading.asObservable();
    }

}
