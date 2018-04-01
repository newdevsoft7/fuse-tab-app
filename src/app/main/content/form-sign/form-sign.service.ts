import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';
import { HttpClient } from "@angular/common/http";

const FORM_URL = `${environment.apiUrl}/form`;

@Injectable()
export class FormSignService {
  constructor(
    private http: HttpClient
  ) {}

  async addLevelRequirement(formId: number, requirement: string, lvl: string): Promise<any> {
    const url = `${FORM_URL}/form/${formId}/requirement/lvl`;
    return this.http.put(url, { requirement, lvl }).toPromise();
  }
}
