import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UsersChatService } from '../../main/content/users/chat/chat.service';

firebase.initializeApp({
  messagingSenderId: '557767382630'
});

@Injectable()
export class FCMService {
  messaging = firebase.messaging();

  constructor(
    private usersChatService: UsersChatService) {}

  async requestPermission(): Promise<any> {
    try {
      await this.messaging.requestPermission();
      const token = await this.messaging.getToken().catch(e => {
        throw new Error(e.message || 'Permission request denied');
      });
      if (token) {
        this.updateFirebaseToken(token);
      }
    } catch (e) {
      throw new Error(e.message || 'Permission request denied');
    }
  }

  async updateFirebaseToken(token: string) {
    try {
      if (this.usersChatService.isDeviceSaved) {
        await this.usersChatService.updateDevice(token);
      } else {
        const deviceId = await this.usersChatService.registerDevice(token);
        this.usersChatService.Device = deviceId;
      }
    } catch (e) { console.log(e); }
  }

  refreshToken() {
    this.messaging.onTokenRefresh(async () => {
      const token = await this.messaging.getToken();
      this.updateFirebaseToken(token);
    });
  }
}
