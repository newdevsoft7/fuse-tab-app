import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UsersChatService } from '../main/content/users/chat/chat.service';

const SOCKET_SERVER_URL = environment.socketServerUrl;

@Injectable()
export class SocketService {
  conn: WebSocket;
  webSocketData = new BehaviorSubject(null);

  constructor(
    private usersChatService: UsersChatService) {

    this.conn = new WebSocket(SOCKET_SERVER_URL);
  }

  initialized(): Observable<any> {
    return new Observable(observer => {
      this.conn.onopen = () => {
        observer.next();
        observer.complete();
      };
    });
  }

  listenData(): void {
    this.conn.onmessage = (e) => {
      this.webSocketData.next(e);
    };
  }

  sendData(data: any): void {
    this.conn.send(data);
  }
}
