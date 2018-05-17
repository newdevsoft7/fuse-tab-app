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

    getExperiences(userId: number): Promise<any> {
        const url = `${BASE_URL}/profile/${userId}/experience`;
        return this.http.get(url).toPromise();
    }

    createExperience(userId: number, data: any): Promise<any> {
        const url = `${BASE_URL}/profile/${userId}/experience`;
        return this.http.post(url, data).toPromise();
    }

    updateExperience(data: any): Promise<any> {
        const url = `${BASE_URL}/profile/experience/${data.id}`;
        return this.http.put(url, data).toPromise();
    }

    deleteExperience(expId: number): Promise<any> {
        const url = `${BASE_URL}/profile/experience/${expId}`;
        return this.http.delete(url).toPromise();
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
