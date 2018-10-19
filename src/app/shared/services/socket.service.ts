import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { UsersChatService } from '../../main/content/users/chat/chat.service';
import { AppSettingService } from './app-setting.service';

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

  constructor(
    private appSettingService: AppSettingService
  ) {
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
      this.isConnected = true;
      this.connectionStatus.next(true);
    };
  }

  closed() {
    this.conn.onclose = () => {
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
    data.tenant = this.appSettingService.baseData.name;
    if (this.getState() === WebSocket.OPEN) {
      this.conn.send(JSON.stringify(data));
    } else {
      this.connectionStatus.subscribe((connected: boolean) => {
        if (connected) {
          this.conn.send(JSON.stringify(data));
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
