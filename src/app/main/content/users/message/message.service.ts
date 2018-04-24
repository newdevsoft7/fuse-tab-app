import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { environment } from "../../../../../environments/environment";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MessageService {
  constructor(private http: HttpClient) {}

  searchRecipients(action: string, searchText: string): Observable<any> {
    const url = `${environment.apiUrl}/autocomplete/message/to/${action}/${searchText}`;
    return this.http.get(url);
  }

  searchAttachments(searchText: string): Observable<any> {
    const url = `${environment.apiUrl}/autocomplete/message/attachment/${searchText}`;
    return this.http.get(url);
  }

  searchTemplates(searchText: string): Promise<any> {
    const url = `${environment.apiUrl}/autocomplete/message/template/${searchText}`;
    return this.http.get(url).toPromise();
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

  getTemplate(templateId: number): Promise<any> {
    const url = `${environment.apiUrl}/message/template/${templateId}`;
    return this.http.get(url).toPromise();
  }

  fetchContent(id: string, action: string): Promise<any> {
    const url = `${environment.apiUrl}/message/action/${action}/${id}`;
    return this.http.get(url).toPromise();
  }
}
