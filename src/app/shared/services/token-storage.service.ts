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
    * Set formconnect data
    * @returns {void}
    */
    public setFormconnectData(data: any): void {
        localStorage.setItem('formconnect', JSON.stringify(data));
    }

    /**
     * Get formconnect data
     * @returns {any}
     */
    public getFormconnectData(): any {
        return JSON.parse(localStorage.getItem('formconnect'));
    }

    /**
     * Set quizconnect data
     * @returns {void}
     */
    public setQuizconnectData(data: any): void {
        localStorage.setItem('quizconnect', JSON.stringify(data));
    }

    /**
     * Get quizconnect data
     * @returns {any}
     */
    public getQuizconnectData(): any {
        return JSON.parse(localStorage.getItem('quizconnect'));
    }

    /**
     * Set showcaseconnect data
     * @returns {void}
     */
    public setShowcaseconnectData(data: any): void {
        localStorage.setItem('showcaseconnect', JSON.stringify(data));
    }

    /**
     * Get showcaseconnect data
     * @returns {any}
     */
    public getShowcaseconnectData(): any {
        return JSON.parse(localStorage.getItem('showcaseconnect'));
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
    public setSecondaryUser(user: any, permissions?: any) {
        localStorage.setItem('secondaryUser', JSON.stringify(user));
        if (permissions) {
            localStorage.setItem('permissions', JSON.stringify(permissions));
        }
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
     * Set the required form data
     */
    public setFormData(forms: any[]) {
        localStorage.setItem('formRequired', JSON.stringify(forms));
    }

    /**
     * Get the required form data
     */
    public getFormData(): any {
        const formData = localStorage.getItem('formRequired');
        return formData? JSON.parse(formData) : null;
    }

    /**
     * Remove the required form data
     */
    public removeFormData() {
        localStorage.removeItem('formRequired');
    }

    /**
     * Set permission data
     */
    public setPermissions(permissions: any) {
        localStorage.setItem('permissions', JSON.stringify(permissions));
    }

    /**
     * Get permission data
     */
    public getPermissions() {
        const permissions = localStorage.getItem('permissions');
        return permissions? JSON.parse(permissions) : null;
    }

    /**
     * Remove permission data
     */
    public removePermissions() {
        localStorage.removeItem('permissions');
    }

    /**
     * Get registrant step
     */
    public getRegistrantStep(): number {
        const step = parseInt(this.getUser().lvl.replace('registrant', ''));
        return step < 8 ? step : 7;
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
        localStorage.removeItem('formRequired');
        localStorage.removeItem('permissions');
        localStorage.removeItem('steps');
        localStorage.removeItem('formconnect');
        localStorage.removeItem('quizconnect');
    }
}
