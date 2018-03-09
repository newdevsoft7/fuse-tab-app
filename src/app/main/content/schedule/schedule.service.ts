import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';

const BASE_URL = environment.apiUrl;
const SHIFT_URL = `${BASE_URL}/shifts`;
const TRACKING_URL = `${BASE_URL}/tracking`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;


@Injectable()
export class ScheduleService {
  constructor(
    private http: HttpClient) {}

  async getEvents(fromDate: string, toDate: string): Promise<EventEntity[]> {
    const url = `${SHIFT_URL}/${fromDate}/${toDate}/calendar`;
    return this.http.get<EventEntity[]>(url).toPromise();
  }

  async getShift(id: number): Promise<any> {
    return this.http.get(`${BASE_URL}/shift/${id}`).toPromise();
  }

  getShifts(params): Observable<any> {
    const filters = params.filters ? encodeURIComponent(JSON.stringify(params.filters)) : '';
    const sorts = params.sorts ? encodeURIComponent(JSON.stringify(params.sorts)) : '';
    const pageSize = params.pageSize ? params.pageSize : 5;
    const pageNumber = params.pageNumber ? params.pageNumber : 0;
    const fromDate = params.from;
    const toDate = params.to;

    const url = `${SHIFT_URL}/${fromDate}/${toDate}/list/${pageSize}/${pageNumber}/${filters}/${sorts}`;
    return this.http.get(url.replace(/\/+$/, ''))
      .catch(this.handleError);
  }

  getShiftFilters(fromDate: string, toDate: string, query = '') {
    const url = `${SHIFT_URL}/filter/${fromDate}/${toDate}/${query}`;
    return this.http.get(url.replace(/\/+$/, ''))
      .catch(this.handleError);
  }

  /**
   * Get data for shifts multiple edit
   */
  getShiftsData(): Observable<any> {
    const url = `${SHIFT_URL}/edit`;
    return this.http.get(url).catch(this.handleError);
  }

  /**
   * Get role data for shift multiple edit
   */
  getRoleData(shift_ids): Observable<any> {
    const url = `${BASE_URL}/helpers/roles/edit`;
    return this.http.post(url, { shift_ids }).catch(this.handleError);
  }

  // TODO - Upload shifts
  importShifts(params): Observable<any> {
    const url = `${BASE_URL}/`;
    return this.http.post(url, params).catch(this.handleError);
  }

  updateShift(id: number, data): Observable<any> {
    const url = `${BASE_URL}/shift/${id}`;
    return this.http.put(url, data).catch(this.handleError);
  }

  updateMultipleShifts(params): Observable<any> {
    const url = `${SHIFT_URL}/edit`;
    return this.http.post(url, params).catch(this.handleError);
  }

  getManagers(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/manager/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getLocations(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/location/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getWorkAreas(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/workArea/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getAutoTrackingOptionsByCategory(categoryId: number, query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/tracking/${categoryId}/options/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getClients(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/client/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getRoleRequirements(query): Observable<any> {
    const url = `${AUTOCOMPLETE_URL}/roleRequirement/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getTrackingCategories(): Observable<any> {
    const url = `${TRACKING_URL}/category`;
    return this.http.get(url).catch(this.handleError);
  }

  getTrackingOptionsByCategory(categoryId: number): Observable<any> {
    const url = `${TRACKING_URL}/option/${categoryId}`;
    return this.http.get(url).catch(this.handleError);
  }

  getTrackingOptions(): Observable<any> {
    const url = `${TRACKING_URL}/option`;
    return this.http.get(url).catch(this.handleError);
  }

  createTrackingOption(option): Observable<any> {
    const url = `${TRACKING_URL}/option`;
    return this.http.post(url, option)
      .catch(this.handleError);
  }

  createClient(client): Observable<any> {
    const url = `${BASE_URL}/client`;
    return this.http.post(url, client)
      .catch(this.handleError);
  }

  createShift(shift): Observable<any> {
    const url = `${BASE_URL}/shift`;
    return this.http.post(url, shift)
      .catch(this.handleError);
  }

  createShiftRole(shiftId, role): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/role`;
    return this.http.post(url, role)
      .catch(this.handleError);
  }

  createShiftsRoles(shiftIds, role): Observable<any> {
    return Observable.forkJoin(
      shiftIds.map(shiftId => this.createShiftRole(shiftId, role))
    );  
  };

  getPayLevelCategory(id?: number): Observable<any> {
    const param = typeof id === 'undefined' ? '' : id;
    const url = `${BASE_URL}/payLevel/category/${param}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  publishShift(shiftId, setPublish = 1): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/publish/${setPublish}`;
    return this.http.put(url, {}).catch(this.handleError);
  }

  lockShift(shiftId, setLock = 1): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/lock/${setLock}`;
    return this.http.put(url, {}).catch(this.handleError);
  }

  assignStaffsToRole(userIds, roleId, staffStatusId): Observable<any> {
    return Observable.forkJoin(
      userIds.map(userId => this.assignStaffToRole(userId, roleId, staffStatusId))
    );
  }

  assignStaffToRole(userId, roleId, staffStatusId): Observable<any> {
    const url = `${BASE_URL}/role/${roleId}/assign`;
    return this.http.post(url, {
      user_id: userId,
      staff_status_id: staffStatusId
    }).catch(this.handleError);
  }

  getRoleStaffs(roleId, query): Observable<any> {
    const url = `${BASE_URL}/shift/role/${roleId}/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getRoleStaffsCounts(roleId): Observable<any> {
    return this.getRoleStaffs(roleId, 'counts');
  }

  updateRoleStaff(staffId, data): Observable<any> {
    const url = `${BASE_URL}/role/update/${staffId}`;
    return this.http.put(url, data).catch(this.handleError);
  }

  updateRoleStaffs(staffIds, data): Observable<any> {
    return Observable.forkJoin(
      staffIds.map(staffId => this.updateRoleStaff(staffId, data))
    );
  }

  UpdateRoleDisplayOrder(roleId, direction): Observable<any> {
    const url = `${BASE_URL}/shift/role/${roleId}/${direction}`;
    return this.http.put(url, {}).catch(this.handleError);
  }

  getShiftChecks(shiftId): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/checks`;
    return this.http.get(url).catch(this.handleError);
  }

  getTimezones(): Observable<any> {
    const url = `${BASE_URL}/helpers/timezones`;
    return this.http.get(url)
      .catch(this.handleError);
  }


  getShiftAdminNotes(shiftId): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/adminNote`;
    return this.http.get(url).catch(this.handleError);
  }

  createShiftAdminNote(shiftId, data): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/adminNote`;
    return this.http.post(url, data).catch(this.handleError);
  }

  updateAdminNote(noteId: number, data: any): Observable<any> {
    const url = `${BASE_URL}/shift/adminNote/${noteId}`;
    return this.http.put(url, { ...data })
      .catch(this.handleError);
  }

  deleteShiftAdminNote(noteId): Observable<any> {
    const url = `${BASE_URL}/shift/adminNote/${noteId}`;
    return this.http.delete(url).catch(this.handleError);
  }

  // Shift flag set/unset
  setShiftFlag(shiftId, flagId, flag = 1): Observable<any> {
    const url = `${BASE_URL}/shift/${shiftId}/flag/${flagId}/${flag}`;
    return this.http.put(url, {}).catch(this.handleError);
  }


  // Staff Shift Actions
  applyShiftRole(roleId, reason): Observable<any> {
    const url = `${BASE_URL}/role/${roleId}/apply`;
    return this.http.post(url, { reason }).catch(this.handleError);
  }

  applyCancelShiftRole(roleStaffId): Observable<any> {
    const url = `${BASE_URL}/role/applyCancel/${roleStaffId}`;
    return this.http.post(url, {}).catch(this.handleError);
  }

  replaceShiftRole(roleStaffId, reason: string): Observable<any> {
    const url = `${BASE_URL}/role/replace/${roleStaffId}`;
    return this.http.post(url, { reason }).catch(this.handleError);
  }

  replaceCancelShiftRole(roleStaffId): Observable<any> {
    const url = `${BASE_URL}/role/replaceCancel/${roleStaffId}`;
    return this.http.post(url, {}).catch(this.handleError);
  }

  notAvailableShiftRole(roleId: number): Observable<any> {
    const url = `${BASE_URL}/role/${roleId}/notavailable`;
    return this.http.post(url, {}).catch(this.handleError);
  }

  checkOutShiftRole(roleStaffId: number): Observable<any> {
    const url = `${BASE_URL}/role/checkOut/${roleStaffId}`;
    return this.http.post(url, {}).catch(this.handleError);
  }

  confirmStaffSelection(roleStaffId: number): Observable<any> {
    const url = `${BASE_URL}/role/confirm/${roleStaffId}`;
    return this.http.post(url, {}).catch(this.handleError);
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

}
