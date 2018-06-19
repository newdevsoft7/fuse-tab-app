import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TabComponent } from "../../main/tab/tab/tab.component";

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class ConnectorService {

    formconnectTokenRefreshing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    quizconnectTokenRefreshing$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    currentFormTab$: BehaviorSubject<TabComponent> = new BehaviorSubject(null);
    currentQuizTab$: BehaviorSubject<TabComponent> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    fetchConnectorData(type: string): Promise<any> {
        const url = `${BASE_URL}/token/${type}`;
        return this.http.get(url).toPromise();
    }
}
