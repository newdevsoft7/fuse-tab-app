import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { UsersChatService } from '../../main/content/users/chat/chat.service';

const SOCKET_SERVER_URL = environment.socketServerUrl;

@Injectable()
export class SocketService {
  conn: WebSocket;
  webSocketData = new BehaviorSubject(null);
  connectionStatus = new BehaviorSubject(false);
  isConnected: boolean;

  constructor() {
    this.connect();
  }

  getState() {
    return this.conn.readyState;
  }

  opened() {
    this.conn.onopen = () => {
      this.isConnected = true;
      this.connectionStatus.next(true);
    };
  }

  listenData(): void {
    this.conn.onmessage = (e) => {
      this.webSocketData.next(e);
    };
  }

  sendData(data: any): void {
    if (this.getState() === WebSocket.OPEN) {
      this.conn.send(data);
    } else {
      this.connect();
      const interval = setInterval(() => {
        console.log('========Reconnecting: ', this.getState());
        if (this.getState() === WebSocket.OPEN) {
          clearInterval(interval);
          this.conn.send(data);
        }
      }, 1000);
    }
  }

  closeConnection(): void {
    this.conn.close();
  }

  connect(): void {
    this.conn = new WebSocket(SOCKET_SERVER_URL);
  }
}
