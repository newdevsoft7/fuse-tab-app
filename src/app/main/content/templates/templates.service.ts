import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class TemplatesService {

  constructor(private http: HttpClient) {}

  getFolders(): Promise<any> {
    const url = `${BASE_URL}/message/templateFolders`;
    return this.http.get(url).toPromise();
  }

  getTemplate(id: number): Promise<any> {
    const url = `${BASE_URL}/message/template/${id}`;
    return this.http.get(url).toPromise();
  }

  createTemplate(body: any): Promise<any> {
    const url = `${BASE_URL}/message/template`;
    return this.http.post(url, body).toPromise();
  }

  createFolder(body: any): Promise<any> {
    const url = `${BASE_URL}/message/templateFolder`;
    return this.http.post(url, body).toPromise();
  }

  updateFolder(id, body): Promise<any> {
    const url  = `${BASE_URL}/message/templateFolder/${id}`;
    return this.http.put(url, body).toPromise();
  }

  updateTemplate(id, body): Promise<any> {
    const url  = `${BASE_URL}/message/template/${id}`;
    return this.http.put(url, body).toPromise();
  }

  deleteTemplate(id): Promise<any> {
    const url = `${BASE_URL}/message/template/${id}`;
    return this.http.delete(url).toPromise();
  }

  deleteFolder(id): Promise<any> {
    const url = `${BASE_URL}/message/templateFolder/${id}`;
    return this.http.delete(url).toPromise();
  }

  uploadFile(file: File): Promise<any> {
    const url = `${BASE_URL}/message/attachment`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData).toPromise();
  }

  searchAttachments(searchText: string): Observable<any> {
    const url = `${BASE_URL}/autocomplete/message/attachment/${searchText}`;
    return this.http.get(url);
  }

}
