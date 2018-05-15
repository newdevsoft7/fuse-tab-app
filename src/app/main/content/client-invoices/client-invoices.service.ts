import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

const BASE_URL = `${environment.apiUrl}`;
const CLIENT_URL = `${BASE_URL}/client`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;

@Injectable()
export class ClientInvoicesService {
  constructor(private http: HttpClient) {}

  getInvoices(pageSize, pageNumber, status, filters, sorts): Promise<any> {
    filters = _.isEmpty(filters) ? '' : encodeURIComponent(JSON.stringify(filters));
    sorts = _.isEmpty(sorts) ? '' : encodeURIComponent(JSON.stringify(sorts));
    const url = `${CLIENT_URL}/invoices/${pageSize}/${pageNumber}/${status}/${filters}/${sorts}`;
    return this.http.get(url.replace(/\/+$/, '')).toPromise();
  }

  getInvoice(invoiceId: number): Promise<any> {
    const url = `${CLIENT_URL}/invoice/${invoiceId}`;
    return this.http.get(url).toPromise();
  }

  searchClients(query: string): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/client/${query}`;
    return this.http.get(url);
  }

  sendInvoice(invoiceId: number): Promise<any> {
    const url = `${CLIENT_URL}/invoice/${invoiceId}/send`;
    return this.http.put(url, {}).toPromise();
  }

  paidInvoice(invoiceId: number): Promise<any> {
    const url = `${CLIENT_URL}/invoice/${invoiceId}/paid`;
    return this.http.put(url, {}).toPromise();
  }

  deleteInvoice(invoiceId: number): Promise<any> {
    const url = `${CLIENT_URL}/invoice/${invoiceId}`;
    return this.http.delete(url).toPromise();
  }
}
