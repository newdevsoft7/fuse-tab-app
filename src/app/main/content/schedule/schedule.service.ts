import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';

const BASE_URL = environment.apiUrl;
const SHIFT_URL = `${BASE_URL}/shifts`;
const TRACKING_URL = `${BASE_URL}/tracking`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;


@Injectable()
export class ScheduleService {
  constructor(
    private http: HttpClient) {}

  async getEvents(fromDate: string, toDate: string): Promise<EventEntity[]> {
    const url = `${SHIFT_URL}/${fromDate}/${toDate}/calendar`;

    return this.http.get<EventEntity[]>(url).toPromise();
  }

  async getShift(id: number): Promise<any> {
    return this.http.get(`${BASE_URL}/shift/${id}`).toPromise();
  }

  getManagers(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/manager/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getLocations(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/location/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getWorkAreas(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/workArea/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getAutoTrackingOptionsByCategory(categoryId: number, query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/tracking/${categoryId}/options/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getClients(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/client/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getTrackingCategories(): Observable<any> {
    const url = `${TRACKING_URL}/category`;
    return this.http.get(url).catch(this.handleError);
  }

  getTrackingOptionsByCategory(categoryId: number): Observable<any> {
    const url = `${TRACKING_URL}/option/${categoryId}`;
    return this.http.get(url).catch(this.handleError);
  }

  getTrackingOptions(): Observable<any> {
    const url = `${TRACKING_URL}/option`;
    return this.http.get(url).catch(this.handleError);
  }

  createTrackingOption(option): Observable<any> {
    const url = `${TRACKING_URL}/option`;
    return this.http.post(url, option)
      .catch(this.handleError);
  }

  createClient(client): Observable<any> {
    const url = `${BASE_URL}/client`;
    return this.http.post(url, client)
      .catch(this.handleError);
  }

  createShift(shift): Observable<any> {
    const url = `${BASE_URL}/shift`;
    return this.http.post(url, shift)
      .catch(this.handleError);
  }

  createShifts(shifts): Observable<any> {
    return Observable.forkJoin(
      shifts.map(shift => this.createShift(shift))
    );
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

}
