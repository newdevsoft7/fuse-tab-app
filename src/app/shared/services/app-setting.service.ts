import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class AppSettingService {

    private globalPromise = null; // Global Settings
    baseData: any;
    baseUrl: string;

    constructor(
        private http: HttpClient
    ) {
        this.initBaseUrl();
    }

    initBaseUrl() {
        const host = window.location.hostname;
        this.baseUrl = `https://admin.staffconnect-app.com/api/identify/${host}`;
    }

    clean() {
        this.globalPromise = null;
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.baseUrl, true);
            xhr.responseType = 'json';
            xhr.addEventListener('load', () => {
                this.baseData = xhr.response;
                this.updateFavicon();
                resolve(xhr.response);
            });
            xhr.send();
        });
    }

    updateFavicon() {
        const links: any = document.getElementsByTagName("link");
        for (let link of links) {
            if (link.rel === 'icon' && link.type === 'image/x-icon') {
                link.href = this.baseData.favicon;
                break;
            }
        }
    }
}
