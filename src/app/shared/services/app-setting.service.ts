import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class AppSettingService {

    private globalPromise = null; // Global Settings

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

}
