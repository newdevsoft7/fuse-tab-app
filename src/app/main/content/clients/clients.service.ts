import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

const BASE_URL = `${environment.apiUrl}`;
const CLIENT_URL = `${BASE_URL}/client`;

@Injectable()
export class ClientsService {

  constructor(private http: HttpClient) {}

  getClients(): Promise<any> {
    const url = `${BASE_URL}/clients`;
    return this.http.get(url).toPromise();
  }

  createClient(data: any): Promise<any> {
    return this.http.post(CLIENT_URL, data).toPromise();
  }

  updateClient(data: any): Promise<any> {
    const url = `${CLIENT_URL}/${data.id}`;
    return this.http.put(url, data).toPromise();
  }

  deleteClient(id: number): Promise<any> {
    const url = `${CLIENT_URL}/${id}`;
    return this.http.delete(url).toPromise();
  }

  getClient(id: number): Promise<any> {
    const url = `${CLIENT_URL}/${id}`;
    return this.http.get(url).toPromise();
  }

  getAdminNotes(clientId: number): Promise<any[]> {
    const url = `${CLIENT_URL}/${clientId}/adminNotes`;
    return this.http.get<any[]>(url).toPromise();
  }

  createAdminNote(clientId: number, data): Promise<any> {
    const url = `${CLIENT_URL}/${clientId}/adminNote`;
    return this.http.post(url, data).toPromise();
  }

  updateAdminNote(noteId: number, note: string): Promise<any> {
    const url = `${CLIENT_URL}/adminNote/${noteId}`;
    return this.http.put(url, { note }).toPromise();
  }

  deleteAdminNote(noteId: number): Promise<any> {
    const url = `${CLIENT_URL}/adminNote/${noteId}`;
    return this.http.delete(url).toPromise();
  }
}
