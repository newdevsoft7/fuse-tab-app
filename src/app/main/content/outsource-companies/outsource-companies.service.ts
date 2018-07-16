import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

const BASE_URL = `${environment.apiUrl}`;
const OUTSOURCE_COMPANIES_URL = `${BASE_URL}/outsourceCompany`;

@Injectable()
export class OutsourceCompaniesService {
  constructor(private http: HttpClient) {}

  getAll(): Promise<any> {
    return this.http.get(OUTSOURCE_COMPANIES_URL).toPromise();
  }

  createCompany(data: any): Promise<any> {
    return this.http.post(OUTSOURCE_COMPANIES_URL, data).toPromise();
  }

  updateCompany(data: any): Promise<any> {
    const url = `${OUTSOURCE_COMPANIES_URL}/${data.id}`;
    return this.http.put(url, data).toPromise();
  }

  deleteCompany(id: number): Promise<any> {
    const url = `${OUTSOURCE_COMPANIES_URL}/${id}`;
    return this.http.delete(url).toPromise();
  }

  getCompany(id: number): Promise<any> {
    const url = `${OUTSOURCE_COMPANIES_URL}/${id}`;
    return this.http.get(url).toPromise();
  }

  getAdminNotes(outsourceCompanyId: number): Promise<any[]> {
    const url = `${OUTSOURCE_COMPANIES_URL}/${outsourceCompanyId}/adminNotes`;
    return this.http.get<any[]>(url).toPromise();
  }

  createAdminNote(outsourceCompanyId: number, data): Promise<any> {
    const url = `${OUTSOURCE_COMPANIES_URL}/${outsourceCompanyId}/adminNote`;
    return this.http.post(url, data).toPromise();
  }

  updateAdminNote(noteId: number, note: string): Promise<any> {
    const url = `${OUTSOURCE_COMPANIES_URL}/adminNote/${noteId}`;
    return this.http.put(url, { note }).toPromise();
  }

  deleteAdminNote(noteId: number): Promise<any> {
    const url = `${OUTSOURCE_COMPANIES_URL}/adminNote/${noteId}`;
    return this.http.delete(url).toPromise();
  }
}
