import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SummaryService  {
  constructor(private http: HttpClient) {}

  getSummary(params) {
    const filters = params.filters ? encodeURIComponent(JSON.stringify(params.filters)) : '';
    const fromDate = params.from;
    const toDate = params.to;

    const url = `/shifts/summary/${fromDate}/${toDate}/${filters}`;

    return this.http.get(url.replace(/\/+$/, ''))
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }
}
