import { Injectable } from '@angular/core';
import { AuthService } from 'ngx-auth';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { TokenStorage } from './token-storage.service';

import { UsersChatService } from '../../main/content/users/chat/chat.service';
import { SocketService } from '../socket.service';
import { FavicoService } from '../favico.service';

const BASE_URL = `${environment.apiUrl}`;
const AUTH_URL = `${BASE_URL}/auth`;

interface AccessData {
    access_token: string;
    refresh_token: string;
    user: any;
    message: string;
}

@Injectable()
export class AuthenticationService implements AuthService {

    constructor(
        private http: HttpClient,
        private tokenStorage: TokenStorage,
        private router: Router,
        private usersChatService: UsersChatService,
        private socketService: SocketService,
        private favicoService: FavicoService) { }
    
    /**
     * Check, if user already authorized.
     * @description Should return Observable with true or false values
     * @returns {Observable<boolean>}
     * @memberOf AuthService
     */
    public isAuthorized(): Observable<boolean> {
        return this.tokenStorage
            .getAccessToken()
            .map(token => !!token);
    }

    /**
     * Get access token
     * @description Should return access token in Observable from e.g.
     * localStorage
     * @returns {Observable<string>}
     */
    public getAccessToken(): Observable<string> {
        return this.tokenStorage.getAccessToken();
    }

    /**
     * Function, that should perform refresh token verifyTokenRequest
     * @description Should be successfully completed so interceptor
     * can execute pending requests or retry original one
     * @returns {Observable<any>}
     */
    public refreshToken(): Observable<AccessData> {
        return this.tokenStorage
            .getRefreshToken()
            .switchMap((refreshToken: string) => {
                if (refreshToken) {
                    return this.http.post(`${AUTH_URL}/refresh`, {
                        refresh_token: refreshToken
                    });
                }
            })
            .do(this.saveAccessData.bind(this))
            .catch((err) => {
                this.logout();
                return Observable.throw(err);
            });
    }

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === 401;
    }
    
    public login(username: string, password: string) {
        return this.http.post(`${AUTH_URL}/login`, { username, password })
            .map((tokens: AccessData) => this.saveAccessData(tokens))
            .catch(this.handleError);
    }

    public logout() {
        this.usersChatService.removeDevice();
        if (this.tokenStorage.getUser()) {
            this.disconnectSocket();
        }
        this.http.post(`${AUTH_URL}/logout`, {}).subscribe(res => {});
        this.tokenStorage.clear();
        this.favicoService.setBadge(0);
        this.router.navigate(['/login']);
    }

    public disconnectSocket() {
        this.socketService.sendData(JSON.stringify({
            type: 'disconnect',
            payload: this.tokenStorage.getUser().id
        }));
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
