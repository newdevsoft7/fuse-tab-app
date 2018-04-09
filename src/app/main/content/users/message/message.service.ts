import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { environment } from "../../../../../environments/environment";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MessageService {
  constructor(private http: HttpClient) {}

  searchRecipients(searchText: string): Observable<any> {
    const url = `${environment.apiUrl}/autocomplete/message/to/${searchText}`;
    return this.http.get(url);
  }

  searchAttachments(searchText: string): Observable<any> {
    const url = `${environment.apiUrl}/autocomplete/message/attachment/${searchText}`;
    return this.http.get(url);
  }

  send(body: any): Promise<any> {
    const url = `${environment.apiUrl}/message`;
    return this.http.post(url, body).toPromise();
  }

  uploadFile(file: File): Promise<any> {
    const url = `${environment.apiUrl}/message/attachment`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData).toPromise();
  }
}
