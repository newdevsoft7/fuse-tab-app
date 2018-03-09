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

  reconnectable: boolean = false;

  duration: number = 1000;
  disconnectedTime: number = 0;

  constructor() {
    this.connect();
    this.init();
  }

  init() {
    this.opened();
    this.listenData();
    this.closed();
  }

  getState() {
    return this.conn.readyState;
  }

  opened() {
    this.conn.onopen = () => {
      console.log('=====Connection is open');
      this.isConnected = true;
      this.connectionStatus.next(true);
    };
  }

  closed() {
    this.conn.onclose = () => {
      console.log('=====Connection is closed');
      this.isConnected = false;
      this.connectionStatus.next(false);
      if (this.reconnectable) {
        this.reconnect();
      }
    }
  }

  reconnect() {
    this.enableReconnect();
    this.connect();
    this.opened();
    const interval = setInterval(() => {
      console.log('========Reconnecting... Current status is ', this.getState());
      if (this.getState() === WebSocket.OPEN) {
        clearInterval(interval);
        this.listenData();
        this.closed();
        this.disconnectedTime = 0;
        this.duration = 1000;
      } else {
        this.disconnectedTime++;
        if (this.disconnectedTime > 10) {
          this.duration = 10000;
        }
      }
    }, this.duration);
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
      console.log('connection is not ready. please wait...');
      this.connectionStatus.subscribe((connected: boolean) => {
        if (connected) {
          console.log('connection is ready! please send data');
          this.conn.send(data);
        }
      });
    }
  }

  disableReconnect(): void {
    if (this.reconnectable) {
      this.reconnectable = false;
    }
  }

  enableReconnect(): void {
    if (!this.reconnectable) {
      this.reconnectable = true;
    }
  }

  closeConnection(): void {
    this.conn.close();
  }

  connect(): void {
    this.conn = new WebSocket(SOCKET_SERVER_URL);
  }
}
