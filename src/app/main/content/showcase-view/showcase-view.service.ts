import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ShowcaseViewService {
  constructor(private http: HttpClient) {}

  getUserCard(userId: number, cardId: number): Promise<any> {
    return this.http.get(`/user/${userId}/card/${cardId}`).toPromise();
  }
}
