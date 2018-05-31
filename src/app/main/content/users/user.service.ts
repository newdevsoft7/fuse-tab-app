import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const USERS_URL = `${BASE_URL}/users`;
const AUTOCOMPLETE_URL = `${BASE_URL}/autocomplete`;

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    /**
     * GET api/users/{pageSize}/{pageNumber}/{filters}/{sorts?}
     */
    getUsers(param = null): Observable<any> {
        let url = `${USERS_URL}/20/0/${decodeURIComponent(JSON.stringify(["active:=:active"]))}`;

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
        return this.http.post(url, data)
            .catch(this.handleError);
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

    getUserRatings(userId: number): Observable<any> {
        const url = `${BASE_URL}/user/${userId}/rating`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    setUserRatings(userId, ratingId, score): Observable<any> {
        const url = `${BASE_URL}/user/${userId}/rating/${ratingId}/${score}`;
        return this.http.put(url, {})
            .catch(this.handleError);
    }

    uploadProfileVideo(userId: number, data: any): Observable<any> {
        const url = `${BASE_URL}/profile/${userId}/video`;
        return this.http.post(url, data)
            .catch(this.handleError);
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
        const url = `${BASE_URL}/profile/${userId}/outsourceCompany/${companyId}/${set? 1 : 0}`;
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

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
