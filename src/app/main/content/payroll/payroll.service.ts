import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';

const BASE_URL = environment.apiUrl;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;

@Injectable()
export class PayrollService {

    constructor(
        private http: HttpClient
    ) { }

    getPayrolls(pageSize, pageNumber, status, filters, sorts): Observable<any> {
        filters = _.isEmpty(filters) ? '' : encodeURIComponent(JSON.stringify(filters));
        sorts = _.isEmpty(sorts) ? '' : encodeURIComponent(JSON.stringify(sorts));
        const url = `${BASE_URL}/payrolls/${pageSize}/${pageNumber}/${status}/${filters}/${sorts}`;
        return this.http.get(url.replace(/\/+$/, ''))
            .catch(this.handleError);
    }

    getPayroll(id: number): Observable<any> {
        const url = `${BASE_URL}/payroll/${id}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    generatePayroll(type, from, to, completedOnly, trackingOptionId = null): Observable<any> {
        let url = `${BASE_URL}/payroll/generate/${type}/${from}/${to}/${completedOnly}`;
        if (trackingOptionId) {
            url = `${url}/${trackingOptionId}`;
        }
        return this.http.get(url)
            .catch(this.handleError);
    }

    processPayrolls(ids: any[]): Observable<any> {
        const url = `${BASE_URL}/payrolls/process`;
        return this.http.put(url, { ids })
            .catch(this.handleError);
    }

    savePayroll(params): Observable<any> {
        const url = `${BASE_URL}/payroll/save`;
        return this.http.post(url, params).catch(this.handleError);
    }

    getUsers(query): Observable<any> {
        const url = `${AUTOCOMPLETE_URL}/users/thiscompany/${query}`;
        return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
    }

    generateStaffInvoice(from: string, to: string): Promise<any> {
        const url = `${BASE_URL}/staffInvoice/generate/${from}/${to}`;
        return this.http.get(url).toPromise();
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
