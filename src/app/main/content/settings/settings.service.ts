import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';
import { Subject } from 'rxjs/Subject';
import { SettingsSideNavModel } from './sidenav/sidenav.model';

const SETTINGS_URL = `${environment.apiUrl}/settings`;

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
}