import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

const SHOWCASE_URL = `${environment.apiUrl}/showcase`;

@Injectable()
export class ShowcaseService {
  constructor(private http: HttpClient) {}

  saveTemplate(data: any): Promise<any> {
    const url = `${SHOWCASE_URL}/template/saved`;
    return this.http.post(url, data).toPromise();
  }

  getTemplateByOtherId(otherId: number): Promise<any> {
    const url = `${SHOWCASE_URL}/getTemplateByOtherId/${otherId}`;
    return this.http.get(url).toPromise();
  }
}
