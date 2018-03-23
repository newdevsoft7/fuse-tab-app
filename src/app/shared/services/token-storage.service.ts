import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TokenStorage {

    userSwitchListener: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
    * Set settings
    * @returns {void}
    */
    public setSettings(settings: any): void {
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    /**
     * Get settings
     * @returns {any}
     */
    public getSettings(): any {
        return JSON.parse(localStorage.getItem('settings'));
    }

    /**
    * Set steps for registrant
    * @returns {void}
    */
    public setSteps(steps: any): void {
        localStorage.setItem('steps', JSON.stringify(steps));
    }

    /**
     * Get steps for registrant
     * @returns {any}
     */
    public getSteps(): any {
        return JSON.parse(localStorage.getItem('steps'));
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
     * Set secondary user information
     */
    public setSecondaryUser(user: any) {
        localStorage.setItem('secondaryUser', JSON.stringify(user));
    }

    /**
     * Check if secondary user exists
     */
    public isExistSecondaryUser(): boolean {
        return !!localStorage.getItem('secondaryUser');
    }

    /**
     * Remove secondary user
     */
    public removeSecondaryUser() {
        localStorage.removeItem('secondaryUser');
    }

    /**
     * Get user information
     * @returns {any}
     */
    public getUser(): any {
        const secondaryUser = localStorage.getItem('secondaryUser');
        return secondaryUser? JSON.parse(secondaryUser) : JSON.parse(localStorage.getItem('user'));
    }

    /**
    * Remove tokens
    */
    public clear() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('secondaryUser');
        localStorage.removeItem('settings');
    }
}
