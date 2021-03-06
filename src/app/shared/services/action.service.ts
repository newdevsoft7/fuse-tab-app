import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ActionService {

  private _usersToInvite = new Subject();
  private _usersToSelect = new Subject();
  userToShift = new Subject();
  userToGroup = new Subject();
  deleteRole$ = new Subject();
  
  // Presentation
  selectedPresentationId$: BehaviorSubject<number> = new BehaviorSubject(null);
  selectedPresentationId: number = null;

  // Payrolls changed by generating payrolls
  payrollsChanged$: Subject<boolean> = new Subject();
  selectedPayrollType: string = null;

  // Shift Edit
  private _shiftsToEdit = new Subject();

  constructor() { }

  inviteUsersToRole(payload: { shiftId, userIds, filters, role, inviteAll, messaging }) {
    this._usersToInvite.next(payload);
  }

  get usersToInvite() {
    return this._usersToInvite.asObservable();
  }

  selectUsersToRole(payload: { shiftId, userIds, filters, role, selectAll, messaging }) {
    this._usersToSelect.next(payload);
  }

  get usersToSelect() {
    return this._usersToSelect.asObservable();
  }

  addShiftsToEdit(shifts) {
    this._shiftsToEdit.next(shifts);
  }

  get shiftsToEdit() {
    return this._shiftsToEdit.asObservable();
  }

}
