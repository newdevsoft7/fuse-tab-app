import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { environment } from '../../../../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

const BASE_URL = `${environment.apiUrl}`;
const USER_URL = `${BASE_URL}/user`;
const CHAT_URL = `${BASE_URL}/chat`;

@Injectable()
export class UsersChatService {

  currentMessage = new BehaviorSubject(null);
  unreadList: any = [];
  unreadThreads: number[] = [];

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

  async sendMessage(body: any): Promise<any> {
    const url = `${CHAT_URL}/message`;
    return this.http.post(url, body).toPromise();
  }

  async getMessagesByThread(threadId: number, page: number): Promise<any> {
    const url = `${CHAT_URL}/thread/${threadId}/${page}`;
    return this.http.get(url).map((_: any) => _.map(message => ({ ...message, ...{ read: true } }))).toPromise();
  }

  async getUnreadMessages(): Promise<any> {
    const url = `${USER_URL}/message/unread`;
    return this.http.get(url).toPromise();
  }

  async updateReadStatus(id: number): Promise<any> {
    const url = `${CHAT_URL}/thread/${id}/read`;
    return this.http.put(url, {}).toPromise();
  }

  async getThreads() {
    const url = `${CHAT_URL}/threads`;
    return this.http.get(url).toPromise();
  }

  async searchRecipient(searchText: string, type?: string) {
    type = type || 'user';
    const url = `${BASE_URL}/autocomplete/chatThread/${searchText}`;
    if (type === 'all') {
      return this.http.get(url).toPromise();
    } else {
      return this.http.get(url).map((_: any) => _.filter(user => user.type === type)).toPromise();
    }
  }

  async addUserIntoThread(threadId: number, userId: number) {
    const url = `${CHAT_URL}/thread/${threadId}/user/${userId}`;
    return this.http.post(url, {}).toPromise();
  }

  private handleError(error): Promise<any> {
    return Promise.reject(error);
  }
}
