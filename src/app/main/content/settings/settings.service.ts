import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';
import { Subject } from 'rxjs/Subject';
import { SettingsSideNavModel } from './sidenav/sidenav.model';

const BASE_URL = `${environment.apiUrl}`;
const WORK_AREA_URL = `${environment.apiUrl}/workArea`;

@Injectable()
export class SettingsService {

    onSideNavChanged: Subject<any> = new Subject();
    sidenavs:any[];

    constructor(
        private http: HttpClient) { 
            this.sidenavs = new SettingsSideNavModel().model;
        }

    
    getSideNavs(){
        return this.sidenavs;
    }

    /**
     * Toggle selected sidenav
     * @param sidenav
     */
    toggleSelectedSideNav( sidenav: any ){
        this.onSideNavChanged.next( sidenav );       
    }

    getSelectedSideNav(): Observable<any>{
        return this.onSideNavChanged.asObservable();
    }


    getWorkAreas(): Observable<any> {
        return this.http.get(WORK_AREA_URL)
            .catch(this.handleError);
    }

    createWorkArea(workarea): Observable<any> {
        return this.http.post(WORK_AREA_URL, workarea)
            .catch(this.handleError);
    }

    updateWorkArea(workareaId: number, data: any): Observable<any> {
        const url = `${WORK_AREA_URL}/${workareaId}`;
        return this.http.put(url, { ...data })
            .catch(this.handleError);
    }

    deleteWorkArea(workareaId: number): Observable<any> {
        const url = `${WORK_AREA_URL}/${workareaId}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getWorkAreaCategories(): Observable<any> {
        const url = `${WORK_AREA_URL}/category`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createWorkAreaCategory(workareaCat): Observable<any> {
        const url = `${WORK_AREA_URL}/category`;
        return this.http.post(url, workareaCat)
            .catch(this.handleError);
    }

    updateWorkAreaCategory(workareaCatId: number, data: any): Observable<any> {
        const url = `${WORK_AREA_URL}/category/${workareaCatId}`;
        return this.http.put(url, { ...data })
            .catch(this.handleError);
    }

    deleteWorkAreaCategory(workareaCatId: number): Observable<any> {
        const url = `${WORK_AREA_URL}/category/${workareaCatId}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getTimezones(): Observable<any> {
        const url = `${BASE_URL}/helpers/timezones`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }    
}