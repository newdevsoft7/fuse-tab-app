import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class AppSettingService {

    private globalPromise = null; // Global Settings
    baseData: any;
    baseDataUpdated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private http: HttpClient
    ) {
    }

    getGlobalSettings() {
        const url = `${BASE_URL}/settings`;
        if (!this.globalPromise) {
            this.globalPromise = this.http.get(url)
                .toPromise();
        }
        return this.globalPromise;
    }

    clean() {
        this.globalPromise = null;
    }

    getBaseData() {
        const url = environment.baseUrl;
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url, true);

        xhr.addEventListener('load', () => {
            const res = xhr.response;
            this.baseData = res;
            this.baseDataUpdated$.next(true);
        });
        xhr.send();
    }

}
