import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const USERS_URL = `${BASE_URL}/users`;

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any> {
        return this.http.get(USERS_URL)
            .catch(this.handleError);
    }

    getUser(id: number): Observable<any> {
        return this.http.get(`${BASE_URL}/profile/${id}`)
            .catch(this.handleError);
    }

    createUser(user): Observable<any> {
        const url = `${BASE_URL}/user`;
        return this.http.post(url, user)
            .catch(this.handleError);
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
    };

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

    getUsersFilters(query: string): Observable<any> {
        const url = `${USERS_URL}/filter/${query}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
