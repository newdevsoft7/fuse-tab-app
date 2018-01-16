import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProfileField } from '../profile-field.model';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const PROFILE_STRUCTURE_URL = `${BASE_URL}/profileStructure`;

@Injectable()
export class ProfileInfoService {
	constructor(private http: HttpClient) { }

	// Returns all fields including categories, elements, and options
	getFields(): Observable<any> {
		const url = `${BASE_URL}/profile/structure`;
        return this.http.get(url);
	}

	getCategories(): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/category`;
		return this.http.get(url);
	}

	createCategory(categoryName: string): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/category`;
		return this.http.post(url, {
			cname: categoryName
		});
	}

	updateCategory(category: ProfileField): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/category/${category.id}`;
		return this.http.put(url, category);
	}

	deleteCategory(id: number): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/category/${id}`;
		return this.http.delete(url);
	}



	getElements(): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/element`;
		return this.http.get(url);
	}

	createElement(element: ProfileField): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/element`;
		return this.http.post(url, element);
	}

	updateElement(element: ProfileField): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/element/${element.id}`;
		return this.http.put(url, element);
	}

	deleteElement(id: number): Observable<any> {
		const url = `${PROFILE_STRUCTURE_URL}/element/${id}`;
		return this.http.delete(url);
	}

	getHeaderItems(): Observable<any> {
		return Observable.forkJoin([
			this.http.get(`${PROFILE_STRUCTURE_URL}/element`).map((res: {data : any[]}) => res.data),
			this.http.get(`${PROFILE_STRUCTURE_URL}/category`).map((res: {data: any[]}) => res.data)
		]).map((data: any[]) => {
			const elements = data[0];
			const categories = data[1];
			elements.forEach(e => {
				const category = categories.find(c => c.id == e.profile_category_id);
				e.name = category ? `${category.cname} - ${e.ename}` : e.ename;
			});
			return elements;
		});
	}


}
