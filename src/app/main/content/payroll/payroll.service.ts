import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';

const BASE_URL = environment.apiUrl;

@Injectable()
export class PayrollService {

    constructor(
        private http: HttpClient
    ) { }

    getPayrolls(pageSize, pageNumber, status, filters, sorts): Observable<any> {
        const url = `${BASE_URL}/payrolls/${pageSize}/${pageNumber}/${status}/${filters}/${sorts}`;
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

    savePayroll(params): Observable<any> {
        const url = `${BASE_URL}/payroll/save`;
        return this.http.post(url, params).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
