import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { environment } from '../../../../environments/environment';
import { SCMessageService } from '../../../shared/services/sc-message.service';

const BASE_URL = environment.apiUrl;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;

@Injectable()
export class PayrollService {

    constructor(
        private http: HttpClient,
        private scMessageService: SCMessageService
    ) { }

    getPayrolls(pageSize, pageNumber, status, filters, sorts): Observable<any> {
        filters = _.isEmpty(filters) ? '' : encodeURIComponent(JSON.stringify(filters));
        sorts = _.isEmpty(sorts) ? '' : encodeURIComponent(JSON.stringify(sorts));
        const url = `${BASE_URL}/payrolls/${pageSize}/${pageNumber}/${status}/${filters}/${sorts}`;
        return this.http.get(url.replace(/\/+$/, ''))
            .catch(this.handleError);
    }

    getSinglePayrollDetail(id: number): Promise<any> {
        const url = `${BASE_URL}/payroll/${id}`;
        return this.http.get(url).toPromise();
    }

    getMultiPayrollsDetail(ids: number[]): Promise<any> {
        const url = `${BASE_URL}/payrolls/${ids.join()}`;
        return this.http.get(url).toPromise();
    }

    deletePayroll(id: number): Observable<any> {
        const url = `${BASE_URL}/payroll/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    rejectPayroll(id: number, reason: string): Observable<any> {
        const url = `${BASE_URL}/payroll/${id}/reject`;
        return this.http.put(url, { reason })
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

    processPayroll(id: string | number): Promise<any> {
      const url = `${BASE_URL}/payroll/${id}/process`;
      return this.http.put(url, {}).toPromise();
    }

    savePayroll(params): Observable<any> {
        const url = `${BASE_URL}/payroll/save`;
        return this.http.post(url, params).catch(this.handleError);
    }

    saveStaffInvoice(params): Observable<any> {
        const url = `${BASE_URL}/staffInvoice/save`;
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

    payPayrollWithXtrm(payrollId: number): Promise<any> {
        const url = `${BASE_URL}/payroll/${payrollId}/xtrm/pay`;
        return this.http.post(url, {}).toPromise();
    }

    recordPayment(ids: any[]): Observable<any> {
        const url = `${BASE_URL}/payrolls/recordPayment`;
        return this.http.put(url, { ids })
            .catch(this.handleError);
    }

    getPayrollDates(date: string = ''): Promise<any> {
        const url = `${BASE_URL}/xero/payroll/dates/${date}`;
        return this.http.get(url.replace(/\/+$/, '')).toPromise(); 
    }

    downloadPayrollsAsXlsx(payloads: {
      payroll_ids: number[],
      filter?: any[],
      extra_info?: any[],
      show_reimbursements: boolean,
      show_line_items: boolean
    }) {
      const filename = 'invoice ' + payloads.payroll_ids.join('-') + '.xlsx';
      const url = `${BASE_URL}/payrolls/export`;
      return this.http.post(url, payloads, { observe: 'response', responseType: 'blob'}).toPromise()
        .then(res => this.downloadFile(res['body'], filename))
        .catch(e => this.scMessageService.error(e));
    }

    downloadFile(data, filename = null) {
      const dwldLink = document.createElement('a');
      const url = URL.createObjectURL(data);
      const isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
        dwldLink.setAttribute('target', '_blank');
      }
      dwldLink.setAttribute('href', url);
      if (filename) {
        dwldLink.setAttribute('download', filename);
      }
      dwldLink.style.visibility = 'hidden';
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
