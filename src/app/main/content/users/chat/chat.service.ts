import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../../environments/environment';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const USER_URL = `${BASE_URL}/user`;


import { FuseUtils } from '../../../../core/fuseUtils';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UsersChatService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private http: HttpClient) {}

  get Device(): number {
    return parseInt(localStorage.getItem('device'), 10);
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

  async removeDevice(): Promise<any> {
    const url = `${USER_URL}/device/${this.Device}`;
    return await this.http.delete(url).toPromise();
  }

  async registerDevice(firebase_token: string) {
    const url = `${USER_URL}/device`;
    try {
      const deviceId = await this.http.post(url, { firebase_token }).map((_: any) => _.id).toPromise();
      this.Device = deviceId;
    } catch (e) {
      throw new Error(e.message || 'Something is wrong');
    }
  }

  async updateDevice(firebase_token: string) {
    const url = `${USER_URL}/device/${this.Device}`;

    try {
      await this.http.put(url, { firebase_token }).toPromise();
    } catch (e) {
      throw new Error(e.message || 'Something is wrong');
    }
  }

  async sendMessage(body: any): Promise<any> {
    const url = `${USER_URL}/message`;
    return this.http.post(url, body).toPromise();
  }

  async getMessagesByUser(userId: number) {
    const url = `${USER_URL}/${userId}/message`;
    return this.http.get(url).toPromise();
  }

  async getUnreadMessages() {
    const url = `${USER_URL}/message/unread`;
    return this.http.get(url).toPromise();
  }

  async updateReadStatus(ids: number[]) {
    const url = `${USER_URL}/message/unread`;
    return this.http.post(url, { ids }).toPromise();
  }
}
