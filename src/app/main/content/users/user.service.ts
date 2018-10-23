import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { SCMessageService } from '../../../shared/services/sc-message.service';
import { uuid } from 'lodash-uuid';

const BASE_URL = `${environment.apiUrl}`;
const USERS_URL = `${BASE_URL}/users`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private scMessageService: SCMessageService
  ) { }

  /**
   * GET api/users/{pageSize}/{pageNumber}/{filters}/{sorts?}
   */
  getUsers(param = null): Observable<any> {
    let url = `${USERS_URL}/20/0/${decodeURIComponent(JSON.stringify(['active:=:active']))}`;

    if (param) {
      const filters = param.filters ? encodeURIComponent(JSON.stringify(param.filters)) : '';
      const sorts = param.sorts ? encodeURIComponent(JSON.stringify(param.sorts)) : '';
      const pageSize = param.pageSize ? param.pageSize : 5;
      const pageNumber = param.pageNumber ? param.pageNumber : 0;
      url = `${USERS_URL}/${pageSize}/${pageNumber}/${filters}/${sorts}`;
    }

    return this.http.get(url.replace(/\/+$/, ''))
      .catch(this.handleError);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/profile/${id}`)
      .catch(this.handleError);
  }

  getUserOptions(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/user/${id}/options`)
      .catch(this.handleError);
  }

  updateUserOption(userId: number, data: any): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/option`;
    return this.http.put(url, data).toPromise();
  }

  getUserPermissions(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/user/${id}/permissions`)
      .catch(this.handleError);
  }

  updateUserPermission(userId: number, data: any): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/permission`;
    return this.http.put(url, data).toPromise();
  }

  approveRegistrant(id): Promise<any> {
    const url = `${BASE_URL}/user/${id}/approve`;
    return this.http.put(url, []).toPromise();
  }

  rejectRegistrant(id): Promise<any> {
    const url = `${BASE_URL}/user/${id}/reject`;
    return this.http.put(url, []).toPromise();
  }

  createUser(user): Observable<any> {
    const url = `${BASE_URL}/user`;
    return this.http.post(url, user)
      .catch(this.handleError);
  }

  updateUser(id, body: any): Promise<any> {
    const url = `${BASE_URL}/user/${id}`;
    return this.http.put(url, body).toPromise();
  }

  updateProfile(userId: number, elementId: number | string, data: any): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/${elementId}`;
    return this.http.put(url, { data })
      .catch(this.handleError);
  }

  uploadProfilePhoto(userId: number, data: any): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/photo`;
    return this.http.request(new HttpRequest(
      'POST',
      url,
      data,
      {
        reportProgress: true
      }
    )).catch(this.handleError);
  }

  getProfilePhotos(userId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/photos`;
    return this.http.get(url)
      .catch(this.handleError);
  }

  deleteProfileFile(fileId: number, fileType: string): Observable<any> {
    const url = `${BASE_URL}/file/${fileType}/${fileId}`;
    return this.http.delete(url)
      .catch(this.handleError);
  }

  setProfilePhoto(userId: number, photoId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/photo/${photoId}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  lockProfilePhoto(photoId: number, setLock = 1): Observable<any> {
    const url = `${BASE_URL}/profilePhoto/${photoId}/lock/${setLock}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  setProfilePhotoAsAdmin(photoId: number, setAdmin: number): Observable<any> {
    const url = `${BASE_URL}/profilePhoto/${photoId}/adminOnly/${setAdmin}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  rotateProfilePhoto(photoId: number, deg: number): Observable<any> {
    const url = `${BASE_URL}/profilePhoto/${photoId}/rotate/${deg}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  getAdminNotes(userId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/adminNote`;
    return this.http.get(url)
      .catch(this.handleError);
  }

  createAdminNote(userId: number, data: any): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/adminNote`;
    return this.http.post(url, { ...data })
      .catch(this.handleError);
  }

  updateAdminNote(noteId: number, data: any): Observable<any> {
    const url = `${BASE_URL}/profile/adminNote/${noteId}`;
    return this.http.put(url, { ...data })
      .catch(this.handleError);
  }

  deleteAdminNote(noteId: number): Observable<any> {
    const url = `${BASE_URL}/profile/adminNote/${noteId}`;
    return this.http.delete(url)
      .catch(this.handleError);
  }

  getProfileVideos(userId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/videos`;
    return this.http.get(url)
      .catch(this.handleError);
  }

  getUserRatings(userId: number): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/rating`;
    return this.http.get(url).toPromise();
  }

  setUserRatings(userId, ratingId, score): Observable<any> {
    const url = `${BASE_URL}/user/${userId}/rating/${ratingId}/${score}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  uploadProfileVideo(userId: number, data: any, isChunk?: boolean): Observable<any> {
    isChunk = isChunk || false;
    const url = `${BASE_URL}/profile/${userId}/video${isChunk ? '/chunk' : ''}`;
    return this.http.request(new HttpRequest(
      'POST',
      url,
      data,
      {
        reportProgress: true
      }
    )).catch(this.handleError);
  }

  lockProfileVideo(videoId: number, setLock = 1): Observable<any> {
    const url = `${BASE_URL}/profileVideo/${videoId}/lock/${setLock}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  setProfileVideoAsAdmin(videoId: number, setAdmin: number): Observable<any> {
    const url = `${BASE_URL}/profileVideo/${videoId}/adminOnly/${setAdmin}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  getProfileDocuments(userId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/documents`;
    return this.http.get(url)
      .catch(this.handleError);
  }

  lockProfileDocument(documentId: number, setLock = 1): Observable<any> {
    const url = `${BASE_URL}/profileDocument/${documentId}/lock/${setLock}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }

  uploadProfileDocument(userId: number, data: any): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/document`;
    return this.http.post(url, data)
      .catch(this.handleError);
  }

  setProfileDocumentAsAdmin(documentId: number, setAdmin: number): Observable<any> {
    const url = `${BASE_URL}/profileDocument/${documentId}/adminOnly/${setAdmin}`;
    return this.http.put(url, {})
      .catch(this.handleError);
  }


  getProfileAttributes(userId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/attributes`;
    return this.http.get(url)
      .catch(this.handleError);
  }

  updateProfileAttribute(userId: number, attributeId: number, value: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/attribute`;
    return this.http.put(url, { attribute_id: attributeId, set: value })
      .catch(this.handleError);
  }


  getProfileWorkAreas(userId: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/workAreas`;
    return this.http.get(url)
      .catch(this.handleError);
  }

  updateProfileWorkArea(userId: number, workAreaId: number, value: number): Observable<any> {
    const url = `${BASE_URL}/profile/${userId}/workArea`;
    return this.http.put(url, { work_area_id: workAreaId, set: value })
      .catch(this.handleError);
  }

  getUsersFilters(query: string): Promise<any> {
    const url = `${USERS_URL}/filter/${query}`;
    return this.http.get(url.replace(/\/+$/, '')).toPromise();
  }

  getRoleRequirementsByRole(roleId: number | string): Promise<any> {
    const url = `${BASE_URL}/role/${roleId}/roleRequirements`;
    return this.http.get(url).toPromise();
  }

  getUsersTypeFilters(): Promise<any> {
    const url = `${USERS_URL}/typeFilter`;
    return this.http.get(url).toPromise();
  }

  getUserAvailabilities(userId): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/unavailability`;
    return this.http.get(url).toPromise();
  }

  deleteUserAvailability(id): Promise<any> {
    const url = `${BASE_URL}/user/unavailability/${id}`;
    return this.http.delete(url).toPromise();
  }

  addUserAvailability(body): Promise<any> {
    const url = `${BASE_URL}/user/unavailability`;
    return this.http.post(url, body).toPromise();
  }

  fetchClients(query: string): Promise<any> {
    const url = `${AUTOCOMPLETE_URL}/client/${query}`;
    return this.http.get(url).toPromise();
  }

  fetchOutsourceCompanies(query: string): Promise<any> {
    const url = `${AUTOCOMPLETE_URL}/outsourceCompany/${query}`;
    return this.http.get(url).toPromise();
  }

  changePassword(userId: number, password: string): Observable<any> {
    const url = `${BASE_URL}/user/${userId}/password`;
    return this.http.put(url, { password })
      .catch(this.handleError);
  }

  getPermissionWorkAreas(userId: number): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/permissionWorkAreas`;
    return this.http.get(url).toPromise();
  }

  updatePermissionWorkArea(userId: number, data: any): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/permissionWorkArea`;
    return this.http.put(url, data).toPromise();
  }

  getPermissionTrackingOptions(userId: number): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/permissionTrackingOptions`;
    return this.http.get(url).toPromise();
  }

  updatePermissionTrackingOption(userId: number, data: any): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/permissionTrackingOption`;
    return this.http.put(url, data).toPromise();
  }

  searchWorkAreas(query: string): Promise<any> {
    const url = `${AUTOCOMPLETE_URL}/workArea/${query}`;
    return this.http.get(url).toPromise();
  }

  searchTrackingOptions(catId: number | string, query: string): Promise<any> {
    const url = `${AUTOCOMPLETE_URL}/tracking/${catId}/options/${query}`;
    return this.http.get(url).toPromise();
  }

  getOutsourceCompaniesForUser(userId: number): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/outsourceCompanies`;
    return this.http.get(url).toPromise();
  }

  updateOutsourceCompanyForUser(userId: number, companyId: number, set: boolean): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/outsourceCompany/${companyId}/${set ? 1 : 0}`;
    return this.http.put(url, {}).toPromise();
  }

  deleteUser(id: number): Promise<any> {
    const url = `${BASE_URL}/user/${id}`;
    return this.http.delete(url).toPromise();
  }

  assignReport(id: number, data: any): Observable<any> {
    const url = `${BASE_URL}/report/${id}/assign`;
    return this.http.post(url, data)
      .catch(this.handleError);
  }

  getAvailableForms(userId: number): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/forms`;
    return this.http.get(url).toPromise();
  }

  getTimezones(): Promise<any> {
    const url = `${BASE_URL}/helpers/timezones`;
    return this.http.get(url).toPromise();
  }

  getLinkedAccounts(userId: number): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/links`;
    return this.http.get(url).toPromise();
  }

  updateLink(userId: number, linked: boolean): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/${linked ? 'link' : 'unlink'}`;
    return this.http.put(url, {}).toPromise();
  }

  approveCompany(linkId: number): Promise<any> {
    const url = `${BASE_URL}/profile/link/${linkId}/approve`;
    return this.http.put(url, {}).toPromise();
  }

  getUserPayLevels(userId: number | string): Promise<any[]> {
    const url = `${BASE_URL}/user/${userId}/payLevels`;
    return this.http.get<any[]>(url).toPromise<any[]>();
  }

  setUserPayLevel(userId: number | string, payLevelId: number | string, set = 1): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/payLevel/${payLevelId}/${set}`;
    return this.http.put(url, {}).toPromise();
  }

  getXtrmSetup(userId: number | string): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/xtrm/setup`;
    return this.http.get(url).toPromise();
  }

  setXtrmSetup(userId: number | string): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/xtrm/setup`;
    return this.http.post(url, {}).toPromise();
  }

  authorizeXtrmSetup(userId: number | string, code: string): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/xtrm/setup/authorise`;
    return this.http.post(url, { otp: code }).toPromise();
  }

  searchBanks(param: {
    bankName: string,
    countryCode: string,
    page: number,
    city?: string
  }): Promise<any> {
    const city = param.city ? param.city : '';
    const url = `${BASE_URL}/xtrm/banks/search/${param.bankName}/${param.countryCode}/${param.page}/${city}`;
    return this.http.get(url.replace(/\/+$/, '')).toPromise();
  }

  addUserBank(userId: number | string, bank: {
    contact_name: string,
    currency: string,
    wtype: string,
    country_code: string,
    bank_name: string,
    bank_swift: string,
    bank_account: string,
    bank_routing?: string,
    bank_branch: string
  }): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/xtrm/bank`;
    return this.http.post(url, bank).toPromise();
  }

  getCurrencies(): Promise<any[]> {
    const url = `${BASE_URL}/helpers/currencies`;
    return this.http.get<any[]>(url).toPromise();
  }

  getCountries(): Promise<any[]> {
    const url = `${BASE_URL}/helpers/countries`;
    return this.http.get<any[]>(url).toPromise();
  }

  getCountriesForBank(): Promise<any[]> {
    const url = `${BASE_URL}/helpers/bank/countries`;
    return this.http.get<any[]>(url).toPromise();
  }

  userWithdraw(userId, walletId, body: {
    method: string,
    amount: number,
    bank_id?: number,
    email?: string,
    otp?: string
  }): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/xtrm/wallet/${walletId}/withdraw`;
    return this.http.put(url, body).toPromise();
  }

  getUserWallets(userId): Promise<any[]> {
    const url = `${BASE_URL}/user/${userId}/xtrm/wallets`;
    return this.http.get<any[]>(url).toPromise();
  }

  addTag(kind: 'photo' | 'video', id: number, tag: string): Observable<string[]> {
    const newKind = kind === 'photo' ? 'profilePhoto' : 'profileVideo';
    const url = `${BASE_URL}/${newKind}/${id}/tag`;
    return this.http.put<string[]>(url, { tag });
  }

  removeTag(kind: 'photo' | 'video', id: number, tag: string): Observable<string[]> {
    const newKind = kind === 'photo' ? 'profilePhoto' : 'profileVideo';
    const url = `${BASE_URL}/${newKind}/${id}/untag`;
    return this.http.put<string[]>(url, { tag });
  }

  retags(kind: 'photo' | 'video', id: number, tags: string[]): Promise<string[]> {
    const newKind = kind === 'photo' ? 'profilePhoto' : 'profileVideo';
    const url = `${BASE_URL}/${newKind}/${id}/retag`;
    return this.http.put<string[]>(url, { tags }).toPromise();
  }

  getTags(kind: 'photo' | 'video'): Promise<string[]> {
    const newKind = kind === 'photo' ? 'profilePhoto' : 'profileVideo';
    const url = `${BASE_URL}/settings/tag/${newKind}`;
    return this.http.get<string[]>(url).toPromise();
  }

  getCards(): Promise<any[]> {
    const url = `${BASE_URL}/cards`;
    return this.http.get<any[]>(url).toPromise();
  }

  getCard(id: number | string): Promise<any> {
    const url = `${BASE_URL}/card/${id}`;
    return this.http.get(url).toPromise();
  }

  getUserCard(userId: number, cardId: number): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/card/${cardId}`;
    return this.http.get(url).toPromise();
  }

  createCard(name: string): Promise<any> {
    const url = `${BASE_URL}/card`;
    return this.http.post(url, { name }).toPromise();
  }

  tagCard(cardId, type: 'photo' | 'video', tag): Promise<any> {
    const url = `${BASE_URL}/card/${cardId}/${type}/tag`;
    return this.http.put(url, { tag }).toPromise();
  }

  untagCard(cardId, type: 'photo' | 'video', tag): Promise<any> {
    const url = `${BASE_URL}/card/${cardId}/${type}/untag`;
    return this.http.put(url, { tag }).toPromise();
  }

  updateCard(cardId: number, data: any): Promise<any> {
    const url = `${BASE_URL}/card/${cardId}`;
    return this.http.put(url, data).toPromise();
  }

  deleteCard(id: number | string): Promise<any> {
    const url = `${BASE_URL}/card/${id}`;
    return this.http.delete(url).toPromise();
  }

  getShowcaseTemplates(): Promise<any[]> {
    const url = `${BASE_URL}/showcase/templates/card`;
    return this.http.get<any[]>(url).toPromise();
  }

  getPresentations(): Promise<any[]> {
    const url = `${BASE_URL}/presentations`;
    return this.http.get<any[]>(url).toPromise();
  }

  getPresentation(id: number | string): Promise<any> {
    const url = `${BASE_URL}/presentation/${id}`;
    return this.http.get(url).toPromise();
  }

  createPresentation(body: {
    name: string,
    users?: number[]
  }): Promise<any> {
    const url = `${BASE_URL}/presentation`;
    return this.http.post(url, body).toPromise();
  }

  savePresentation(id: number | string, body: {
    name?: string,
    card_id?: number,
    showcase_template_id?: number,
    users?: number[]
  }): Promise<any> {
    if (!body.card_id) {
      delete body.card_id;
    }
    const url = `${BASE_URL}/presentation/${id}`;
    return this.http.put(url, body).toPromise();
  }

  deletePresentation(id: number | string): Promise<any> {
    const url = `${BASE_URL}/presentation/${id}`;
    return this.http.delete(url).toPromise();
  }

  addUserToPresentation(presentationId: number | string, userId: string | number): Promise<any> {
    const url = `${BASE_URL}/presentation/${presentationId}/addUser/${userId}`;
    return this.http.put(url, {}).toPromise();
  }

  addUsersToPresentation(presentationId: number | string, userIds: number[]): Promise<any[]> {
    return Observable.forkJoin(
      userIds.map(user => this.addUserToPresentation(presentationId, user))
    ).toPromise();
  }

  removeUserFromPresentation(presentationId: number | string, userId: string | number): Promise<any> {
    const url = `${BASE_URL}/presentation/${presentationId}/removeUser/${userId}`;
    return this.http.put(url, {}).toPromise();
  }

  getUserOutsourceCompanies(userId: string | number): Promise<any> {
    const url = `${BASE_URL}/profile/${userId}/outsourceCompanies`;
    return this.http.get(url).toPromise();
  }

  getUserSignature(userId: number | string): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/signature`;
    return this.http.get(url).toPromise();
  }

  updateUserSignature(userId: number | string, signature: string): Promise<any> {
    const url = `${BASE_URL}/user/${userId}/signature`;
    return this.http.put(url, { signature }).toPromise();
  }

  export(params: {
    user_ids?: number[],
    user_type?: string,
    filters?: string[],
    extra_info?: string[]
  }) {
    const fileName = `${uuid()}.csv`;
    const url = `${BASE_URL}/users/export`;
    return this.http.post(url, params, { observe: 'response', responseType: 'blob'}).toPromise()
      .then(res => this.downloadFile(res['body'], fileName))
      .catch(e => this.scMessageService.error(e));
  }

  downloadFile(data, filename = null) {
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(data);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    if (filename) {
      dwldLink.setAttribute('download', filename);
    }
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }
}
