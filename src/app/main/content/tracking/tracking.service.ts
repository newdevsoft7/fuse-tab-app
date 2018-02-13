import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';
import { Subject } from 'rxjs/Subject';
import { TrackingOption, TrackingCategory } from './tracking.models';

const BASE_URL = `${environment.apiUrl}`;
const TRACKING_CATEGORY_URL = `${environment.apiUrl}/tracking/category`;
const TRACKING_OPTION_URL = `${environment.apiUrl}/tracking/option`;

@Injectable()
export class TrackingService {

    onSelectCategoryChanged: Subject<any> = new Subject();
    OnCategoriesChanged:Subject<any> = new Subject();

    constructor(private http: HttpClient) { 

    }

    toggleSelectedCategory(cateogry: TrackingCategory ) {
        this.onSelectCategoryChanged.next(cateogry);
    }

    getSelectedCategory(): Observable<TrackingCategory> {
        return this.onSelectCategoryChanged.asObservable();
    }

    toggleCategories(categories: TrackingCategory[]){
        this.OnCategoriesChanged.next(categories);
    }

    getCategories(): Observable<TrackingCategory[]> {
        return this.OnCategoriesChanged.asObservable();
    }

    getTrackingOptions(): Observable<any> {
        return this.http.get(TRACKING_OPTION_URL)
            .catch(this.handleError);
    }
    
    getTrackingOptionsByCategory(categoryId: number): Observable<any> {
        const url = `${TRACKING_OPTION_URL}/${categoryId}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createTrackingOption(trackingOption: TrackingOption): Observable<any> {
        return this.http.post(TRACKING_OPTION_URL, trackingOption)
            .catch(this.handleError);
    }

    updateTrackingOption(trackingOption: TrackingOption): Observable<any> {
        const url = `${TRACKING_OPTION_URL}/${trackingOption.id}`;
        return this.http.put(url, { ...trackingOption })
            .catch(this.handleError);
    }

    deleteTrackingOption(trackingOptionId: number): Observable<any> {
        const url = `${TRACKING_OPTION_URL}/${trackingOptionId}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getTrackingCategories(): Observable<any> {
        return this.http.get(TRACKING_CATEGORY_URL)
            .catch(this.handleError);
    }

    createTrackingCategory(trackingCategory: TrackingCategory): Observable<any> {
        return this.http.post(TRACKING_CATEGORY_URL, trackingCategory)
            .catch(this.handleError);
    }

    updateTrackingCategory(trackingCategory: TrackingCategory): Observable<any> {
        const url = `${TRACKING_CATEGORY_URL}/${trackingCategory.id}`;
        return this.http.put(url, { ...trackingCategory })
            .catch(this.handleError);
    }

    deleteTrackingCategory(trackingCategoryId: number): Observable<any> {
        const url = `${TRACKING_CATEGORY_URL}/${trackingCategoryId}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }    

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }    
}