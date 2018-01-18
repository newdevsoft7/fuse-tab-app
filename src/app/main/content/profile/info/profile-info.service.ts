import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProfileField } from '../profile-field.model';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const PROFILE_STRUCTURE_URL = `${BASE_URL}/profileStructure`;

@Injectable()
export class ProfileInfoService {
    constructor(private http: HttpClient) { }

    // Returns all fields including categories, elements, and options
    getFields(): Observable<any> {
        const url = `${BASE_URL}/profile/structure`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    getCategories(): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/category`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createCategory(category: ProfileField): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/category`;
        return this.http.post(url, category)
            .catch(this.handleError);
    }

    updateCategory(category: ProfileField): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/category/${category.id}`;
        return this.http.put(url, category)
            .catch(this.handleError);
    }

    deleteCategory(id: number): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/category/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }



    getElements(): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/element`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    createElement(element: ProfileField): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/element`;
        return this.http.post(url, element)
            .catch(this.handleError);
    }

    updateElement(element: ProfileField): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/element/${element.id}`;
        return this.http.put(url, element)
            .catch(this.handleError);
    }

    deleteElement(id: number): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/element/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    createListOption(element: ProfileField, option): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/element/${element.id}/option`;
        return this.http.post(url, {
            option: option.option
        }).catch(this.handleError);
    }

    deleteListOption(id: number): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/option/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    updateListOption(option): Observable<any> {
        const url = `${PROFILE_STRUCTURE_URL}/option/${option.id}`;
        return this.http.put(url, option)
            .catch(this.handleError);
    }

    getHeaderItems(): Observable<any> {
            return forkJoin([
            this.http.get(`${PROFILE_STRUCTURE_URL}/element`).map((res: {data: any[]}) => res.data),
            this.http.get(`${PROFILE_STRUCTURE_URL}/category`).map((res: {data: any[]}) => res.data)
        ]).map((data: any[]) => {
            const elements = data[0];
            const categories = data[1];
            elements.forEach(e => {
                const category = categories.find(c => c.id == e.profile_cat_id);
                e.name = category ? `${category.cname} - ${e.ename}` : e.ename;
            });
            return elements;
        });
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }

}
