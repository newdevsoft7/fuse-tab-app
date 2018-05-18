import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class RegisterService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Register in any steps except first step
     * @param step
     * @param params
     */
    registerByStep(step: string, params: any): Observable<any> {
        const url = `${BASE_URL}/register`;
        return this.http.post(url, { step, ...params })
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
