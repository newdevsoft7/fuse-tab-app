import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class UsersProfileExperienceService {

  constructor(private http: HttpClient) {}

  getExperiences(userId: number): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/experience`;
    return this.http.get(url).toPromise();
  }

  createExperience(userId: number, data: any): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/experience`;
    return this.http.post(url, data).toPromise();
  }

  updateExperience(data: any): Promise<any> {
    const url = `${BASE_URL}/profile/experience/${data.id}`;
    return this.http.put(url, data).toPromise();
  }

  deleteExperience(expId: number): Promise<any> {
    const url = `${BASE_URL}/profile/experience/${expId}`;
    return this.http.delete(url).toPromise();
  }
}
