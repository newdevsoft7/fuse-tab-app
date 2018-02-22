import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomLoadingService {

    private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() { }

    showLoadingSpinner() {
        this.loading.next(true);
    }

    hideLoadingSpinner() {
        this.loading.next(false);
    }

    get isLoading(): Observable<boolean> {
        return this.loading.asObservable();
    }

}
