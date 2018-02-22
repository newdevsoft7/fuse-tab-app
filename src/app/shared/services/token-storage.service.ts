import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

@Injectable()
export class TokenStorage {

    /**
     * Get access token
     * @returns {string}
     */
    public getAccessToken(): string {
        return <string>localStorage.getItem('accessToken');
    }

    /**
     * Get refresh token
     * @returns {string}
     */
    public getRefreshToken(): string {
        return <string>localStorage.getItem('refreshToken');
    }

    /**
     * Set access token
     * @returns {void}
     */
    public setAccessToken(token: string): void {
        localStorage.setItem('accessToken', token);
    }

    /**
    * Set refresh token
    * @returns {void}
    */
    public setRefreshToken(token: string): void {
        localStorage.setItem('refreshToken', token);
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
