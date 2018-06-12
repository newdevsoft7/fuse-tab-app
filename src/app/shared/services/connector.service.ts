import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class ConnectorService {

    formconnectUpdated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private http: HttpClient) {}

    fetchFormconnectData(): Promise<any> {
        const url = `${BASE_URL}/token/formconnect`;
        return this.http.get(url).toPromise();
    }
}
