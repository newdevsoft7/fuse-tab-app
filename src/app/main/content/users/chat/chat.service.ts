import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TokenStorage } from '../../../../shared/authentication/token-storage.service';
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
    return await this.http.delete(url).toPromise();
  }

  async registerDevice(firebase_token: string): Promise<any> {
    const url = `${USER_URL}/device`;
    try {
      const deviceId = await this.http.post(url, { 
        firebase_token,
        user_id: this.getUserId()
      }).map((_: any) => _.id).toPromise();
      this.Device = deviceId;
    } catch (e) {
      await this.handleError(e);
    }
  }

  async updateDevice(firebase_token: string): Promise<any> {
    const url = `${USER_URL}/device/${this.Device}`;
    try {
      await this.http.put(url, { 
        firebase_token,
        user_id: this.getUserId()
      }).toPromise();
    } catch (e) {
      await this.handleError(e);
    }
  }

  async sendMessage(body: any): Promise<any> {
    const url = `${USER_URL}/message`;
    return this.http.post(url, body).toPromise();
  }

  async getMessagesByUser(userId: number): Promise<any> {
    const url = `${USER_URL}/${userId}/message`;
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
