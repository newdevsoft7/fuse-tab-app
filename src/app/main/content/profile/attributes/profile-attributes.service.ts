import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProfileField } from '../profile-field.model';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import 'rxjs/add/operator/map';
import { ProfileAttribute, ProfileAttributeCategory } from './profile-attribute.models';

const BASE_URL = `${environment.apiUrl}`;
const ATTRIBUTE_URL = `${BASE_URL}/attribute`;
const ATTRIBUTE_CATEGORY_URL = `${ATTRIBUTE_URL}/category`

@Injectable()
export class ProfileAttributesService {
    constructor(private http: HttpClient) { }

    getAttributes(): Observable<ProfileAttribute[]> {
        return this.http.get(ATTRIBUTE_URL)
            .catch(this.handleError);
    }

    createAttribute(attribute: ProfileAttribute): Observable<any> {
        return this.http.post(ATTRIBUTE_URL, attribute)
            .catch(this.handleError);
    }

    updateAttribute(attribute: ProfileAttribute): Observable<any> {
        const url = `${ATTRIBUTE_URL}/${attribute.id}`;
        return this.http.put(url, attribute)
            .catch(this.handleError);
    }

    updateAttributeUser(categoryId: number, attributeId: number, role: string): Observable<any> {
        const url = `${BASE_URL}/attributeUser/${categoryId}/${attributeId}`;
        return this.http.put(url, role)
            .catch(this.handleError);
    }

    deleteAttribute(id: number): Observable<any> {
        const url = `${ATTRIBUTE_URL}/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    getCategories(): Observable<any> {
        return this.http.get(ATTRIBUTE_CATEGORY_URL)
            .catch(this.handleError);
    }

    createCategory(category: ProfileAttributeCategory): Observable<any> {
        return this.http.post(ATTRIBUTE_CATEGORY_URL, category)
            .catch(this.handleError);
    }

    updateCategory(category: ProfileAttributeCategory): Observable<any> {
        const url = `${ATTRIBUTE_CATEGORY_URL}/${category.id}`;
        return this.http.put(url, category)
            .catch(this.handleError);
    }

    deleteCategory(id: number): Observable<any> {
        const url = `${ATTRIBUTE_CATEGORY_URL}/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }


    private handleError(error: Response | any) {
        return Observable.throw(error);
    }

}
