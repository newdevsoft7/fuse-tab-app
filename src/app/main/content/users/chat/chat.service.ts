import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { environment } from '../../../../../environments/environment';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const USER_URL = `${BASE_URL}/user`;

@Injectable()
export class UsersChatService {

  currentMessage = new BehaviorSubject(null);
  unreadList: any = [];

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage) {
  }

  get Device(): number {
    return parseInt(localStorage.getItem('device'));
  }

  set Device(device: number) {
    if (device) {
      localStorage.setItem('device', device.toString());
    } else {
      localStorage.removeItem('device');
    }
  }

  get isDeviceSaved(): boolean {
    return !!localStorage.getItem('device');
  }

  getUserId() {
    return this.tokenStorage.getUser()? this.tokenStorage.getUser().id : null;
  }

  async removeDevice(): Promise<any> {
    const url = `${USER_URL}/device/${this.Device}`;
    return this.http.delete(url).toPromise();
  }

  async registerDevice(firebase_token: string): Promise<any> {
    const url = `${USER_URL}/device`;
    return this.http.post(url, { 
      firebase_token,
      user_id: this.getUserId()
    }).map((_: any) => _.id).toPromise();
  }

  async updateDevice(firebase_token: string): Promise<any> {
    const url = `${USER_URL}/device/${this.Device}`;
    return this.http.put(url, { 
      firebase_token,
      user_id: this.getUserId()
    }).toPromise();
  }

  async addContactSession(user_id: number) {
    const url = `${BASE_URL}/sessions`;
    return this.http.post(url, { user_id }).toPromise();
  }

  async getContactSessions() {
    const url = `${BASE_URL}/sessions`;
    return this.http.get(url).toPromise();
  }

  async sendMessage(body: any): Promise<any> {
    const url = `${USER_URL}/message`;
    return this.http.post(url, body).toPromise();
  }

  async getMessagesBySession(sessionId: number): Promise<any> {
    const url = `${BASE_URL}/sessions/${sessionId}/message`;
    return this.http.get(url).toPromise();
  }

  async getUnreadMessages(): Promise<any> {
    const url = `${USER_URL}/message/unread`;
    return this.http.get(url).toPromise();
  }

  async updateReadStatus(ids: number[]): Promise<any> {
    const url = `${USER_URL}/message/unread`;
    return this.http.post(url, { ids }).toPromise();
  }

  private handleError(error): Promise<any> {
    return Promise.reject(error);
  }
}
