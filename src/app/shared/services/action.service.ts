import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActionService {

  private _usersToShift = new Subject();
  private _usersToRole = new Subject();

  // Shift Edit
  private _shiftsToEdit = new Subject();

  constructor() { }

  addUsersToRole({ userIds, role, section }) {
    this._usersToRole.next({ userIds, role, section });
  }
  
  get usersToRole() {
    return this._usersToRole.asObservable();
  }


  addUsersToShift({ userIds, shift }) {
    this._usersToShift.next({ userIds, shift });
  }
  
  get usersToShift() {
    return this._usersToShift.asObservable();
  }


  addShiftsToEdit(shifts) {
    this._shiftsToEdit.next(shifts);
  }

  get shiftsToEdit() {
    return this._shiftsToEdit.asObservable();
  } 

}
