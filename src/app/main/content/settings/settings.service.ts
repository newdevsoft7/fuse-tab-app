import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { SettingsSideNavModel } from './sidenav/sidenav.model';

import * as _ from 'lodash';

const BASE_URL = `${environment.apiUrl}`;
const WORK_AREA_URL = `${environment.apiUrl}/workArea`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;


@Injectable()
export class SettingsService {

    onSideNavChanged: Subject<any> = new Subject();
    sidenavs: any[];

    constructor(
        private http: HttpClient) {
            this.sidenavs = new SettingsSideNavModel().model;
        }

    getSideNavs(){
        return this.sidenavs;
    }

    /**
     * Toggle selected sidenav
     * @param sidenav
     */
    toggleSelectedSideNav(sidenav: any) {
        this.onSideNavChanged.next(sidenav);
    }

    getSelectedSideNav(): Observable<any> {
        return this.onSideNavChanged.asObservable();
    }

    getWorkAreas(): Observable<any> {
        return this.http.get(WORK_AREA_URL)
            .catch(this.handleError);
    }

    createWorkArea(params): Observable<any> {
        return this.http.post(WORK_AREA_URL, params)
            .catch(this.handleError);
    }

    updateWorkArea(id: number, params): Observable<any> {
        const url = `${WORK_AREA_URL}/${id}`;
        return this.http.put(url, params)
            .catch(this.handleError);
    }

    deleteWorkArea(id: number): Observable<any> {
        const url = `${WORK_AREA_URL}/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getWorkAreaCategories(): Observable<any> {
        const url = `${WORK_AREA_URL}/category`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createWorkAreaCategory(cname): Observable<any> {
        const url = `${WORK_AREA_URL}/category`;
        return this.http.post(url, { cname })
            .catch(this.handleError);
    }

    updateWorkAreaCategory(id: number, cname): Observable<any> {
        const url = `${WORK_AREA_URL}/category/${id}`;
        return this.http.put(url, { cname })
            .catch(this.handleError);
    }

    deleteWorkAreaCategory(id: number): Observable<any> {
        const url = `${WORK_AREA_URL}/category/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getTimezones(): Observable<any> {
        const url = `${BASE_URL}/helpers/timezones`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    async getSetting(id?: number): Promise<any> {
        const url = `${BASE_URL}/setting/${_.isUndefined(id) ? '' : id}`;
        return this.http.get(url.replace(/\/+$/, '')).toPromise();
    }

    async getSettingOptions(id?: number): Promise<any> {
        const url = `${BASE_URL}/setting/${_.isUndefined(id) ? 0 : id}/options`;
        return this.http.get(url).toPromise();
    }

    setSetting(id: number, value): Observable<any> {
        const url = `${BASE_URL}/setting/${id}`;
        return this.http.put(url, { value })
            .catch(this.handleError);
    }

    getPayCategories(): Observable<any> {
        const url = `${BASE_URL}/payLevel/category`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    getPayLevelsByCategory(categoryId: number) {
        const url = `${BASE_URL}/payLevel/${categoryId}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    updatePayLevel(id: number, params) {
        const url = `${BASE_URL}/payLevel/${id}`;
        return this.http.put(url, params)
            .catch(this.handleError);
    }

    updatePayCategory(id: number, cname) {
        const url = `${BASE_URL}/payLevel/category/${id}`;
        return this.http.put(url, { cname })
            .catch(this.handleError);
    }

    deletePayLevel(id: number) {
        const url = `${BASE_URL}/payLevel/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    deletePayCategory(id: number) {
        const url = `${BASE_URL}/payLevel/category/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    createPayCategory(cname) {
        const url = `${BASE_URL}/payLevel/category`;
        return this.http.post(url, { cname })
            .catch(this.handleError);
    }

    createPayLevel(params) {
        const url = `${BASE_URL}/payLevel`;
        return this.http.post(url, params)
            .catch(this.handleError);
    }

    getFlags(): Observable<any> {
        const url = `${BASE_URL}/flag`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createFlag(params): Observable<any> {
        const url = `${BASE_URL}/flag`;
        return this.http.post(url, params)
            .catch(this.handleError);
    }

    updateFlag(id: number, params): Observable<any> {
        const url = `${BASE_URL}/flag/${id}`;
        return this.http.put(url, params)
            .catch(this.handleError);
    }

    deleteFlag(id: number): Observable<any> {
        const url = `${BASE_URL}/flag/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getUserStatuses(): Observable<any> {
        const url = `${BASE_URL}/userStatuses`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createUserStatus(params): Observable<any> {
        const url = `${BASE_URL}/userStatus`;
        return this.http.post(url, params)
            .catch(this.handleError);
    }

    updateUserStatus(id: number, params): Observable<any> {
        const url = `${BASE_URL}/userStatus/${id}`;
        return this.http.put(url, params)
            .catch(this.handleError);
    }

    deleteUserStatus(id: number): Observable<any> {
        const url = `${BASE_URL}/userStatus/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getForms(): Observable<any> {
        const url = `${BASE_URL}/forms`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    deleteForm(id: number | string): Promise<any> {
        const url = `${BASE_URL}/form/${id}`;
        return this.http.delete(url).toPromise();
    }

    getQuizes(): Observable<any> {
        const url = `${BASE_URL}/reports/quiz`;
        return this.http.get(url)
          .catch(this.handleError);
    }

    saveQuiz(id: number, params): Observable<any> {
        const url = `${BASE_URL}/report/${id}`;
        return this.http.put(url, params)
          .catch(this.handleError);
    }

    getSurveys(): Observable<any> {
        const url = `${BASE_URL}/reports/survey`;
        return this.http.get(url)
          .catch(this.handleError);
    }

    getSurveysAndReports(): Observable<any> {
        const url = `${BASE_URL}/reports`;
        return this.http.get(url)
          .catch(this.handleError);
    }

    getForm(id: number | string): Observable<any> {
        const url = `${BASE_URL}/form/${id}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    getQuiz(id: number | string): Observable<any> {
        const url = `${BASE_URL}/reports/${id}`;
        return this.http.get(url)
          .catch(this.handleError);
    }

    getQuizesAutoComplete(query): Observable<any> {
        const url = `${AUTOCOMPLETE_URL}/report/quiz/${query}`;
        return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
    }

    addFormLevelRequirement(formId, requirement, lvl): Observable<any> {
        const url = `${BASE_URL}/form/${formId}/requirement/lvl`;
        return this.http.put(url, { requirement, lvl })
            .catch(this.handleError);
    }

    addFormTrackRequirement(formId, requirement, tracking_option_id): Observable<any> {
        const url = `${BASE_URL}/form/${formId}/requirement/track`;
        return this.http.put(url, { requirement, tracking_option_id })
            .catch(this.handleError);
    }

    deleteFormLevelRequirement(id): Observable<any> {
        const url = `${BASE_URL}/form/requirement/lvl/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    deleteFormTrackRequirement(id): Observable<any> {
        const url = `${BASE_URL}/form/requirement/track/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getExternalEmails(): Promise<any[]> {
        const url = `${BASE_URL}/externalEmail`;
        return this.http.get<any[]>(url).toPromise<any[]>();
    }

    saveExternalEmail(body: { name: string, email: string }): Promise<any> {
        const url = `${BASE_URL}/externalEmail`;
        return this.http.post(url, body).toPromise();
    }

    deleteExternalEmail(id: number): Promise<any> {
        const url = `${BASE_URL}/externalEmail/${id}`;
        return this.http.delete(url).toPromise();
    }
    
    getExpenseCategories(): Promise<any[]> {
        const url = `${BASE_URL}/expenseCategories`;
        return this.http.get<any[]>(url).toPromise<any[]>();
    }

    saveExpenseCategory(body: { cname: string }): Promise<any> {
        const url = `${BASE_URL}/expenseCategory`;
        return this.http.post(url, body).toPromise();
    }

    deleteExpenseCategory(id: number): Promise<any> {
        const url = `${BASE_URL}/expenseCategory/${id}`;
        return this.http.delete(url).toPromise();
    }

    getShiftStatuses(): Promise<any[]> {
        const url = `${BASE_URL}/shiftStatuses`;
        return this.http.get<any[]>(url).toPromise<any[]>();
    }

    saveShiftStatus(id, body: {
                    bg_color?: string,
                    border_color?: string,
                    font_color?: string
    }): Promise<any> {
        const url = `${BASE_URL}/shiftStatus/${id}`;
        return this.http.put(url, body).toPromise();
    }

    getStaffStatuses(): Promise<any[]> {
        const url = `${BASE_URL}/staffStatuses`;
        return this.http.get<any[]>(url).toPromise<any[]>();
    }

    saveStaffStatus(id, body: {
                    bg_color?: string,
                    border_color?: string,
                    message?: string
    }): Promise<any> {
        const url = `${BASE_URL}/staffStatus/${id}`;
        return this.http.put(url, body).toPromise();
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
