import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProfileField } from '../profile-field.model';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class ProfileInfoService {
	constructor(private http: HttpClient) { }

	getFields(): Observable<any> {
		const url = `${BASE_URL}/profile/structure`;
        return this.http.get(url);
	}

}
