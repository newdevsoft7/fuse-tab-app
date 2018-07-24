import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

const TEMPLATE_URL = `${environment.apiUrl}/showcase/template`;

@Injectable()
export class ShowcaseService {
  constructor(private http: HttpClient) {}

  saveTemplate(data: any): Promise<any> {
    const url = `${TEMPLATE_URL}/saved`;
    return this.http.post(url, data).toPromise();
  }
}
