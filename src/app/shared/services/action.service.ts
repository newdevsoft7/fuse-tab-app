import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActionService {

  private _usersToShift = new Subject();
  private _usersToRole = new Subject();
  private _usersToInvite = new Subject();
  private _usersToSelect = new Subject();
  deleteRole$ = new Subject();

  // Shift Edit
  private _shiftsToEdit = new Subject();

  constructor() { }

  addUsersToRole({ userIds, role, section }) {
    this._usersToRole.next({ userIds, role, section });
  }

  get usersToRole() {
    return this._usersToRole.asObservable();
  }

  inviteUsersToRole({ shiftId, userIds, filters, role, inviteAll }) {
    this._usersToInvite.next({ shiftId, userIds, filters, role, inviteAll });
  }

  get usersToInvite() {
    return this._usersToInvite.asObservable();
  }

  selectUsersToRole({ shiftId, userIds, role }) {
    this._usersToSelect.next({ shiftId, userIds, role });
  }

  get usersToSelect() {
    return this._usersToSelect.asObservable();
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
