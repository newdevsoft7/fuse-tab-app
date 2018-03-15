import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { TokenStorage } from './token-storage.service';

import { UsersChatService } from '../../main/content/users/chat/chat.service';
import { FavicoService } from './favico.service';

const BASE_URL = `${environment.apiUrl}`;
const AUTH_URL = `${BASE_URL}/auth`;

interface AccessData {
    access_token: string;
    refresh_token: string;
    user: any;
    message: string;
}

@Injectable()
export class AuthenticationService {

    refreshing: boolean = false;
    tokenRefreshed$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(
        private http: HttpClient,
        private tokenStorage: TokenStorage,
        private router: Router,
        private usersChatService: UsersChatService,
        private favicoService: FavicoService) { }
    
    /**
     * Check, if user already authorized.
     * @description Should return true or false
     * @returns {boolean}
     * @memberOf AuthService
     */
    public isAuthorized(): boolean {
        return !!this.getAccessToken();
    }

    /**
     * Get access token
     * @description Should return access token
     * localStorage
     * @returns {string}
     */
    public getAccessToken(): string {
        return this.tokenStorage.getAccessToken();
    }

    /**
     * Function, that should perform refresh token verifyTokenRequest
     * @returns {Observable<any>}
     */
    public refreshToken(): Observable<AccessData> {
        if (this.refreshing) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe((res) => {
                    if (res) {
                        observer.next();
                        observer.complete();
                    }
                });
            });
        } else {
            this.refreshing = true;

            return this.http.post(`${AUTH_URL}/refresh`, {
                refresh_token: this.tokenStorage.getRefreshToken(),
                client_id: 2
            })
            .map((tokens: AccessData) => {
                this.saveAccessData(tokens);
                this.tokenRefreshed$.next(true);
                this.refreshing = false;
            })
            .catch((err) => {
                this.refreshing = false;
                return this.handleError(err);
            });
        }
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === 401;
    }
    
    public login(username: string, password: string) {
        return this.http.post(`${AUTH_URL}/login`, { username, password, client_id: 2 })
            .map((tokens: AccessData) => this.saveAccessData(tokens))
            .catch(this.handleError);
    }

    public async logout() {
        try {
            await this.usersChatService.removeDevice();
        } catch (e) {}
        this.usersChatService.Device = null;
        this.http.post(`${AUTH_URL}/logout`, {}).subscribe(res => {});
        this.tokenStorage.clear();
        this.favicoService.setBadge(0);
        this.router.navigate(['/login']);
    }

    public verifyTokenRequest(url: string): boolean {
        return url.endsWith('refresh');
    }

    // public getHeaders(token) {
    //     return  {'X-Auth-Token': token};
    // }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }

    /**
     * Save access data in the storage
     *
     * @private
     * @param {AccessData} data
     */
    private saveAccessData({ access_token, refresh_token, user }: AccessData) {
        if (access_token) { this.tokenStorage.setAccessToken(access_token); }
        if (refresh_token) { this.tokenStorage.setRefreshToken(refresh_token); }
        if (user) { this.tokenStorage.setUser(user); }
    }

}
