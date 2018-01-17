import { Injectable } from '@angular/core';
import { AuthService } from 'ngx-auth';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { of } from 'rxjs/observable/of';
import { map, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';
import { TokenStorage } from './token-storage.service';

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
        private tokenStorage: TokenStorage) { }
    
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
                return this.http.post(`${AUTH_URL}/refresh`, {
                    refresh_token: refreshToken
                });
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
        return this.http
            .post(`${AUTH_URL}/logout`, {})
            .map(_ => {
                this.tokenStorage.clear();
            }).catch(error => this.handleError(error));
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
        this.tokenStorage
            .setAccessToken(access_token)
            .setRefreshToken(refresh_token)
            .setUser(user);
    }

}
