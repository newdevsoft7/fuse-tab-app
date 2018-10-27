import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

const BASE_URL = `${environment.apiUrl}`;


@Injectable()
export class ActivityLogService {

  constructor(
    private http: HttpClient
  ) { }

  getActivityLog(type: string, options?: {
    id?: number,
    filters?: any[],
    pageSize?: number,
    pageNumber?: number
  }): Promise<any> {
    let url = `${BASE_URL}/activity/${type}`;
    if (options) {
      const pageSize = options.pageSize !== null ? options.pageSize : 50;
      const pageNumber = options.pageNumber !== null ? options.pageNumber : 0
      const id = options.id !== null ? options.id : '';
      const filters = encodeURIComponent(JSON.stringify(options.filters !== null ? options.filters : []));
      url = `${url}/${id}/${filters}/${pageSize}/${pageNumber}`;
    }
    return this.http.get(url).toPromise();
  }

}
