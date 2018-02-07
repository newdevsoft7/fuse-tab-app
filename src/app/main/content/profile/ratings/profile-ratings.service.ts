import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../../environments/environment';
import { EventEntity } from '../../../../core/components/sc-calendar';
import { Subject } from 'rxjs/Subject';

const BASE_URL = `${environment.apiUrl}`;
const RATING_URL = `${environment.apiUrl}/rating`;

@Injectable()
export class ProfileRatingsService {

    onSideNavChanged: Subject<any> = new Subject();
    sidenavs:any[];

    constructor(
        private http: HttpClient) { 
        }

    getRatings(): Observable<any> {
        return this.http.get(RATING_URL)
            .catch(this.handleError);
    }

    createRating(rating): Observable<any> {
        return this.http.post(RATING_URL, rating)
            .catch(this.handleError);
    }

    updateRating(ratingId: number, data: any): Observable<any> {
        const url = `${RATING_URL}/${ratingId}`;
        return this.http.put(url, { ...data })
            .catch(this.handleError);
    }

    deleteRating(ratingId: number): Observable<any> {
        const url = `${RATING_URL}/${ratingId}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

 
    private handleError(error: Response | any) {
        return Observable.throw(error);
    }    
}