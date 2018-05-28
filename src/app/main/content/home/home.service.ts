import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

const BASE_URL = `${environment.apiUrl}`;

@Injectable()
export class HomeService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Create a post
     * @param post
     */
    createPost(post): Observable<any> {
        const url = `${BASE_URL}/post`;
        return this.http.post(url, post)
            .catch(this.handleError);
    }

    /**
     * Create a comment
     * @param postId
     * @param content
     */
    createComment(postId, content: string): Observable<any> {
        const url = `${BASE_URL}/post/${postId}/comment`;
        return this.http.post(url, { content })
            .catch(this.handleError);
    }

    /**
     * Delete a post
     * @param id
     */
    deletePost(id): Observable<any> {
        const url = `${BASE_URL}/post/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    /**
     * Delete a comment
     * @param id
     */
    deleteComment(id): Observable<any> {
        const url = `${BASE_URL}/post/comment/${id}`;
        return this.http.delete(url)
            .catch(this.handleError);
    }

    /**
     * Approve / Unapprove a post
     * @param id
     * @param setApprove
     */
    approvePost(id, setApprove = 1): Observable<any> {
        const url = `${BASE_URL}/post/${id}/approve/${setApprove}`;
        return this.http.put(url, {})
            .catch(this.handleError);
    }

    /**
     *
     * @param id
     * @param setApprove
     */
    approveComment(id, setApprove = 1): Observable<any> {
        const url = `${BASE_URL}/post/comment/${id}/approve/${setApprove}`;
        return this.http.put(url, {})
            .catch(this.handleError);
    }

    /**
     * Like / Unlike a post
     * @param id
     * @param setLike
     */
    likePost(id, setLike = 1): Observable<any> {
        const url = `${BASE_URL}/post/${id}/like/${setLike}`;
        return this.http.put(url, {})
            .catch(this.handleError);
    }

    /**
     * Like / Unlike a comment
     *
     * @param id
     * @param setLike
     */
    likeComment(id, setLike = 1): Observable<any> {
        const url = `${BASE_URL}/post/comment/${id}/like/${setLike}`;
        return this.http.put(url, {})
            .catch(this.handleError);
    }

    /**
     * Get a post
     * @param id
     */
    getPost(id: number): Observable<any> {
        const url = `${BASE_URL}/post/${id}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    /**
     * Get pinned posts
     * @param type
     * @param id
     */
    getPinnedPosts(type = 'main', id = 0): Observable<any> {
        const url = `${BASE_URL}/pinnedPosts/${type}/${id}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    /**
     * Get posts
     * @param pageSize
     * @param pageNumber
     * @param type
     */
    getPosts(pageNumber = 0, pageSize = 10, type = 'main', id = 0): Observable<any> {
        const url = `${BASE_URL}/posts/${type}/${id}/${pageSize}/${pageNumber}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    /**
     * Get comments
     * @param postId
     * @param pageSize
     * @param pageNumber
     */
    getComments(postId, pageNumber = 0, pageSize = 10): Observable<any> {
        const url = `${BASE_URL}/post/${postId}/comments/${pageSize}/${pageNumber}`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    /**
     * Update a post
     * @param id
     * @param post
     */
    updatePost(id: number, post: any): Observable<any> {
        const url = `${BASE_URL}/post/${id}`;
        return this.http.post(url, post)
            .catch(this.handleError);
    }

    /**
     * Update a comment
     * @param id
     * @param comment
     */
    updateComment(id: number, content: string): Observable<any> {
        const url = `${BASE_URL}/post/comment/${id}`;
        return this.http.put(url, { content })
            .catch(this.handleError);
    }

    /**
     * Pin / Unpin a post
     * @param id
     * @param title
     * @param setPin
     */
    pinPost(id: number, setPin = 1, title = ''): Observable<any> {
        const url = `${BASE_URL}/post/${id}/pin/${setPin}`;
        return this.http.put(url, { title })
            .catch(this.handleError);
    }

    /**
     * Get notifications
     */
    getNotifications(): Observable<any> {
        const url = `${BASE_URL}/notifications`;
        return this.http.get(url)
            .catch(this.handleError);
    }

    /**
     * Handle error
     * @param error
     */
    private handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
