import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActionService {

  private _usersToShift = new Subject();
  private _usersToRole = new Subject();

  constructor() { }

  addUsersToRole({ userIds, role, section }) {
    this._usersToRole.next({ userIds, role, section });
  }

  addUsersToShift({ userIds, shift }) {
    this._usersToShift.next({ userIds, shift });
  }

  get usersToShift() {
    return this._usersToShift.asObservable();
  }

  get usersToRole() {
    return this._usersToRole.asObservable();
  }

}
