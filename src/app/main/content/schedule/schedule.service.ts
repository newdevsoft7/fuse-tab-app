import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { EventEntity } from '../../../core/components/sc-calendar';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

const BASE_URL = environment.apiUrl;
const SHIFT_URL = `${BASE_URL}/shifts`;
const TRACKING_URL = `${BASE_URL}/tracking`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;


@Injectable()
export class ScheduleService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  async getEvents(fromDate: string, toDate: string): Promise<EventEntity[]> {
    const url = `${SHIFT_URL}/${fromDate}/${toDate}/calendar`;
    return this.http.get<EventEntity[]>(url).toPromise();
  }

  async getShift(id: string | number): Promise<any> {
    return this.http.get(`${BASE_URL}/shift/${id}`).toPromise();
  }

  getShifts(params): Observable<any> {
    const filters = params.filters ? encodeURIComponent(JSON.stringify(params.filters)) : '';
    console.log(filters);
    const sorts = params.sorts ? encodeURIComponent(JSON.stringify(params.sorts)) : '';
    const pageSize = params.pageSize ? params.pageSize : 5;
    const pageNumber = params.pageNumber ? params.pageNumber : 0;
    const fromDate = params.from;
    const toDate = params.to;
    const view = params.view || 'list';

    const url = `${SHIFT_URL}/${fromDate}/${toDate}/${view}/${pageSize}/${pageNumber}/${filters}/${sorts}`;

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

  updateMultipleRoles(params): Observable<any> {
    const url = `${BASE_URL}/shift/roles/edit`;
    return this.http.put(url, params).catch(this.handleError);
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

  deleteShift(id): Promise<any> {
    const url = `${BASE_URL}/shift/${id}`;
    return this.http.delete(url).toPromise();
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
  }

  deleteShiftRole(roleId: number | string): Promise<any> {
    const url = `${BASE_URL}/shift/role/${roleId}`;
    return this.http.delete(url).toPromise();
  }

  deleteShiftRoles(params: { shift_ids: string[], rname: string }): Promise<any> {
    const url = `${BASE_URL}/shift/roles/delete`;
    return this.http.post(url, params).toPromise();
  }

  updateShiftRole(roleId, role): Observable<any> {
    const url = `${BASE_URL}/shift/role/${roleId}`;
    return this.http.put(url, role)
      .catch(this.handleError);
  }

  getShiftRole(roleId): Promise<any> {
    const url = `${BASE_URL}/shift/role/${roleId}`;
    return this.http.get(url).toPromise();
  }

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
    const url = `${BASE_URL}/role/${roleId}/assign`;
    return this.http.post(url, {
      user_ids: userIds,
      staff_status_id: staffStatusId
    }).catch(this.handleError);
  }

  inviteStaffsToRole(roleId, body: { user_ids?, filters? }): Observable<any> {
    const url = `${BASE_URL}/role/${roleId}/invite`;
    return this.http.post(url, body).catch(this.handleError);
  }

  getRoleStaffs(roleId, query): Observable<any> {
    const url = `${BASE_URL}/shift/role/${roleId}/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getRoleStaffsCounts(roleId): Observable<any> {
    return this.getRoleStaffs(roleId, 'counts');
  }

  removeRoleStaff(staffId): Observable<any> {
    const url = `${BASE_URL}/role/remove/${staffId}`;
    return this.http.put(url, []).catch(this.handleError);
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

  checkOutShiftRole(roleStaffId: number, body: FormData): Promise<any> {
    const url = `${BASE_URL}/role/checkOut/${roleStaffId}`;
    return this.http.post(url, body).toPromise();
  }

  checkInShiftRole(roleStaffId: number, body: FormData): Promise<any> {
    const url = `${BASE_URL}/role/checkIn/${roleStaffId}`;
    return this.http.post(url, body).toPromise();
  }

  confirmStaffSelection(roleStaffId: number): Observable<any> {
    const url = `${BASE_URL}/role/confirm/${roleStaffId}`;
    return this.http.post(url, {}).catch(this.handleError);
  }

  completeShiftRole(roleStaffId: number): Promise<any> {
    const url = `${BASE_URL}/role/complete/${roleStaffId}`;
    return this.http.post(url, {}).toPromise();
  }

  completeCheck(roleStaffId: number): Promise<any> {
    const url = `${BASE_URL}/role/complete/${roleStaffId}`;
    return this.http.get(url).toPromise();
  }

  setShiftTrackingOptions(shiftId, catgegoryId, optionIds: number[]): Promise<any> {
    const url = `${BASE_URL}/shift/${shiftId}/tracking/${catgegoryId}`;
    const body = optionIds.length > 0 ? { ids: optionIds } : {};
    return this.http.put(url, body).toPromise();
  }

  setShiftWorkareas(shiftId, workareaIds: number[]): Promise<any> {
    const url = `${BASE_URL}/shift/${shiftId}/workArea`;
    const body = workareaIds.length > 0 ? { ids: workareaIds } : {};
    return this.http.put(url, body).toPromise();
  }

  getRoleRequirementsByRole(roleId: number | string): Observable<any> {
    const url = `${BASE_URL}/role/${roleId}/roleRequirements/1`;
    return this.http.get(url).catch(this.handleError);
  }

  addPayItem(body: any): Promise<any> {
    const url = `${BASE_URL}/payItem`;
    return this.http.post(url, body).toPromise();
  }

  deletePayItem(id): Promise<any> {
    const url = `${BASE_URL}/payItem/${id}`;
    return this.http.delete(url).toPromise();
  }

  updatePayItem(payItemId, body: any): Promise<any> {
    const url = `${BASE_URL}/payItem/${payItemId}`;
    return this.http.post(url, body).toPromise();
  }

  getShiftAdminNoteType(): Observable<any> {
    const url = `${BASE_URL}/shiftAdminNoteType`;
    return this.http.get(url).catch(this.handleError);
  }

  deleteFile(fileId: number, fileType = 'file'): Promise<any> {
    const url = `${BASE_URL}/file/${fileType}/${fileId}`;
    return this.http.delete(url).toPromise();
  }

  uploadFile(shiftId, file: File): Promise<any> {
    const url = `${BASE_URL}/shift/${shiftId}/file`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData).toPromise();
  }

  importShift(file: File): Promise<any> {
    const url = `${BASE_URL}/shift/import`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData).toPromise();
  }

  getColumnMaps(): Promise<any> {
    const url = `${BASE_URL}/shift/import/columns`;
    return this.http.get(url).toPromise();
  }

  getImportHistory(): Promise<any> {
    const url = `${BASE_URL}/shift/import/history`;
    return this.http.get(url).toPromise();
  }

  saveImport(id, live: boolean): Promise<any> {
    const url = `${BASE_URL}/shift/import/${id}`;
    return this.http.put(url, { live: live ? 1 : 0 }).toPromise();
  }

  saveColumnMap(id, column: string): Promise<any> {
    const url = `${BASE_URL}/shift/import/column/${id}`;
    return this.http.put(url, { column }).toPromise();
  }

  deleteImport(id): Promise<any> {
    const url = `${BASE_URL}/shift/import/${id}`;
    return this.http.delete(url).toPromise();
  }

  groupShifts(body: { gname, shift_ids?, group_ids? }): Promise<any> {
    const url = `${BASE_URL}/group`;
    return this.http.post(url, body).toPromise();
  }

  ungroupShifts(groupId, shift_ids: string[]): Promise<any> {
    const url = `${BASE_URL}/group/${groupId}`;
    return this.http.delete(url, { params: { 'shift_ids[]': shift_ids } }).toPromise();
  }

  ungroupGroups(groupIds, shift_ids: string[]): Promise<any> {
    return Observable.forkJoin(
      groupIds.map(v => this.ungroupShifts(v, shift_ids))
    ).toPromise();
  }

  getShiftGroup(id): Promise<any> {
    const url = `${BASE_URL}/group/${id}`;
    return this.http.get(url).toPromise();
  }

  deleteGroup(id: number | string): Promise<any> {
    const url = `${BASE_URL}/group/${id}/all`;
    return this.http.delete(url).toPromise();
  }

  updateShiftGroup(id, body: {
    gname?: string,
    apply_all_or_nothing?: number,
    client_id?: number,
    address?: string,
    contact?: string,
    location?: string,
    generic_location?: string,
    generic_title?: string,
    manager_ids?: number[],
    live?: number,
    locked?: number
  }): Promise<any> {
    const url = `${BASE_URL}/group/${id}`;
    return this.http.put(url, body).toPromise();
  }

  setGroupFlag(groupId, flagId, flag = 1): Promise<any> {
    const url = `${BASE_URL}/group/${groupId}/flag/${flagId}/${flag}`;
    return this.http.put(url, {}).toPromise();
  }

  setGroupTrackingOptions(groupId, catgegoryId, optionIds: number[]): Promise<any> {
    const url = `${BASE_URL}/group/${groupId}/tracking/${catgegoryId}`;
    const body = optionIds.length > 0 ? { ids: optionIds } : {};
    return this.http.put(url, body).toPromise();
  }

  setGroupWorkareas(groupId, workareaIds: number[]): Promise<any> {
    const url = `${BASE_URL}/group/${groupId}/workArea`;
    const body = workareaIds.length > 0 ? { ids: workareaIds } : {};
    return this.http.put(url, body).toPromise();
  }

  getGroupAdminNotes(id): Observable<any> {
    const url = `${BASE_URL}/group/${id}/adminNote`;
    return this.http.get(url).catch(this.handleError);
  }

  getUnavailableShift(userId: number, id: any): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/unavailability/${id}`;
    return this.http.get(url).toPromise();
  }

  deleteUnavailableShift(id: any): Promise<any> {
    const url = `${BASE_URL}/user/unavailability/${id}`;
    return this.http.delete(url).toPromise();
  }

  getShiftReportsUploads(shiftId: any): Promise<any> {
    const url = `${BASE_URL}/reportsUploads/shift/${shiftId}`;
    return this.http.get(url).toPromise();
  }

  getGroupReportsUploads(groupId: any): Promise<any> {
    const url = `${BASE_URL}/reportsUploads/group/${groupId}`;
    return this.http.get(url).toPromise();
  }

  reportsUploads(body): Promise<any> {
    const url = `${BASE_URL}/reportsUploads/upload`;
    return this.http.post(url, body).toPromise();
  }

  reportsUploadsApprove(type, id, set = 1): Promise<any> {
    const url = `${BASE_URL}/reportsUploads/approve/${type}/${id}/${set}`;
    return this.http.put(url, {}).toPromise();
  }

  deleteCompletedReport(id): Promise<any> {
    const url = `${BASE_URL}/report/completed/${id}`;
    return this.http.delete(url).toPromise();
  }

  getExtraUserInfo(query? : string): Observable<any> {
    if (_.isNil(query)) { query = ''; }
    const url = `${BASE_URL}/autocomplete/extraUserInfo/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).catch(this.handleError);
  }

  getUsersToMessage(type: string, shiftRoleIds: number[]): Promise<any> {
    const url = `${BASE_URL}/shifts/message/${type}`;
    return this.http.put(url, { shift_role_ids: shiftRoleIds }).toPromise();
  }

  getRolesForShiftMessage(shiftIds: number[]): Promise<any> {
    const url = `${BASE_URL}/helpers/roles/message`;
    return this.http.put(url, { shift_ids: shiftIds }).toPromise();
  }

  exportAsCSV(body: any = {}) {
    const url = `${BASE_URL}/shifts/export/csv`;
    return this.http.post(url, body, { observe: 'response', responseType: 'blob'}).toPromise()
      .then(res => this.downloadFile(res['body'], 'shift exports.csv'))
      .catch(e => this.displayError(e));
  }

  overview(body: any = {}) {
    const url = `${BASE_URL}/shifts/overview`;
    return this.http.post(url, body).toPromise();
  }

  getPopupContent(id: number, group?: boolean): Promise<any> {
    const url = group? `${BASE_URL}/group/${id}/popUp` : `${BASE_URL}/shift/${id}/popUp`;
    return this.http.get(url).toPromise();
  }

  getReports(query?): Observable<any> {
    query = query || '';
    const url = `${BASE_URL}/autocomplete/report/survey/${query}`;
    return this.http.get(url.replace(/\/+$/, ''))
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

  downloadFile(data, filename){
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(data);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  private displayError(e: any) {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    }
    else {
      this.toastr.error(e.error.message);
    }
  }

}
