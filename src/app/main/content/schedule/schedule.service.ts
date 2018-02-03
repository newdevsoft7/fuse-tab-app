import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';

const SHIFT_URL = `${environment.apiUrl}/shifts`;

@Injectable()
export class ScheduleService {
  constructor(
    private http: HttpClient) {}

  async getEvents(fromDate: string, toDate: string): Promise<EventEntity[]> {
    const url = `${SHIFT_URL}/${fromDate}/${toDate}/calendar`;

    return this.http.get<EventEntity[]>(url).toPromise();
  }
}
