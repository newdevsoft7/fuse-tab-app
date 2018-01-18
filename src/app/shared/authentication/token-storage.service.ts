import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

@Injectable()
export class TokenStorage {

    /**
     * Get access token
     * @returns {Observable<string>}
     */
    public getAccessToken(): Observable<string> {
        const token: string = <string>localStorage.getItem('accessToken');
        return Observable.of(token);
    }

    /**
     * Get refresh token
     * @returns {Observable<string>}
     */
    public getRefreshToken(): Observable<string> {
        const token: string = <string>localStorage.getItem('refreshToken');
        return Observable.of(token);
    }

    /**
     * Set access token
     * @returns {TokenStorage}
     */
    public setAccessToken(token: string): TokenStorage {
        localStorage.setItem('accessToken', token);

        return this;
    }

    /**
    * Set refresh token
    * @returns {TokenStorage}
    */
    public setRefreshToken(token: string): TokenStorage {
        localStorage.setItem('refreshToken', token);
        return this;
    }


    /**
    * Set user information
    * @returns {TokenStorage}
    */
    public setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
        return this;
    }

    /**
     * Get user information
     * @returns {any}
     */
    public getUser(): any {
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
    * Remove tokens
    */
    public clear() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
}
