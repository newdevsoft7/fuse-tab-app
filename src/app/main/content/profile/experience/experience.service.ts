import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class ProfileExperienceService {

    constructor(
        private http: HttpClient
    ) { }

    getCategories(): Promise<any> {
        const url = `${BASE_URL}/experience/categories`;
        return this.http.get(url).toPromise();
    }

    createCategory(cname: string): Promise<any> {
        const url = `${BASE_URL}/experience/category`;
        return this.http.post(url, { cname }).toPromise();
    }

    updateCategory(id, body: { cname?: string, display_order?, dformat? }): Promise<any> {
        const url = `${BASE_URL}/experience/category/${id}`;
        return this.http.put(url, body).toPromise();
    }

    updateCategoriesDisplayOrder(elements: string[] | number[]): Promise<any> {
        const url = `${BASE_URL}/experience/categories/displayOrder`;
        return this.http.put(url, { elements }).toPromise();
    }

    deleteCategory(id: number | string): Promise<any> {
        const url = `${BASE_URL}/experience/category/${id}`;
        return this.http.delete(url).toPromise();
    }

    createHeading(body: { hname: string, experience_cat_id: number, type }): Promise<any> {
        const url = `${BASE_URL}/experience/heading`;
        return this.http.post(url, body).toPromise();
    }

    updateHeadingsDisplayOrder(body: { elements: string[] | number[] }): Promise<any> {
        const url = `${BASE_URL}/experience/headings/displayOrder`;
        return this.http.put(url, body).toPromise();
    }

    updateHeading(id, body: { hname?: string, display_order?, type?}): Promise<any> {
        const url = `${BASE_URL}/experience/heading/${id}`;
        return this.http.put(url, body).toPromise();
    }

    deleteHeading(id: number | string): Promise<any> {
        const url = `${BASE_URL}/experience/heading/${id}`;
        return this.http.delete(url).toPromise();
    }

    createHeadingOption(body: { oname: string, experience_heading_id: number }): Promise<any> {
        const url = `${BASE_URL}/experience/heading/option`;
        return this.http.post(url, body).toPromise();
    }

    updateHeadingOption(id, body: { oname: string }): Promise<any> {
        const url = `${BASE_URL}/experience/heading/option/${id}`;
        return this.http.put(url, body).toPromise();
    }

    deleteHeadingOption(id: number | string): Promise<any> {
        const url = `${BASE_URL}/experience/heading/option/${id}`;
        return this.http.delete(url).toPromise();
    }
}
