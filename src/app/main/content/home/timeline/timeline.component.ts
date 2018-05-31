import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '../../../../core/animations';

import { HomeService } from '../home.service';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { UserService } from '../../users/user.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { EditPostDialogComponent } from './edit-post-dialog/edit-post-dialog.component';
import { EditCommentDialogComponent } from './edit-comment-dialog/edit-comment-dialog.component';
import { PinPostDialogComponent } from './pin-post-dialog/pin-post-dialog.component';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { TabService } from '../../../tab/tab.service';
import { TAB } from '../../../../constants/tab';
import { Tab } from '../../../tab/tab';
import { ScheduleService } from '../../schedule/schedule.service';
import { Subscription } from 'rxjs/Subscription';

enum PostType {
    Main    = 'main',
    Client  = 'client',
    Ext     = 'ext'
}

@Component({
    selector   : 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls  : ['./timeline.component.scss'],
    animations : fuseAnimations
})
export class TimelineComponent implements OnInit, OnDestroy
{
    activities = [];

    pinnedPosts = [];
    posts: any[] = [];
    page = 0; // Page number of posts
    newPost = ''; // New post content
    file; // New post file
    preview; // Preview of new post file with image type
    canLoadPosts = false; // Ability to load more posts
    postLoading = false;

    user: any;
    dialogRef;
    userSwitcherSubscription: Subscription;

    @Input() lvl: string;
    @Input() otherId: number;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private tokenStorage: TokenStorage,
        private homeService: HomeService,
        private userService: UserService,
        private tabService: TabService,
        private scheduleService: ScheduleService
    ) {
        this.user = this.tokenStorage.getUser();
    }

    ngOnInit() {
        this.fetchData();
        this.userSwitcherSubscription = this.tokenStorage.userSwitchListener.subscribe((isSwitch: boolean) => {
            if (isSwitch) {
                this.fetchData();
            }
        });

        if (window.addEventListener) {
            window.addEventListener('message', this.onMessage.bind(this), false);
        } else if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
        }
    }

    onMessage(event: any) {
        if (event.data && event.data.func) {
            const id = this.tabService.currentTab.data.other_id;
            if (this.tabService.currentTab.url === `home/report/${id}`) {
                this.loadNotifications();
            }
            this.tabService.closeTab(this.tabService.currentTab.url);
        }
    }

    private fetchData() {
        this.userService.getUser(this.user.id).subscribe(res => {
            this.user = res;
            this.user.name = `${this.user.fname} ${this.user.lname}`;
        });
        this.getPosts(true);
        this.getPinnedPosts();
        if (!this.lvl) {
            this.loadNotifications();
        }
    }

    ngOnDestroy() {
        this.tokenStorage.userSwitchListener.next(false);
        this.userSwitcherSubscription.unsubscribe();
    }

    async loadNotifications() {
        try {
            this.activities = await this.homeService.getNotifications().toPromise();
        } catch (e) {
            this.displayError(e);
        }
    }

    getPosts(isFirstCall = false) {

        let type;

        if (this.lvl) {
            type = this.lvl;
        } else {
            type = ['client', 'ext'].includes(this.user.lvl) ? this.user.lvl : 'main';
        }

        if (this.canLoadPosts || isFirstCall) { // If loading posts first or there's more posts to fetch
            this.postLoading = true;
            this.homeService.getPosts(this.page, 10, type, this.otherId || 0).subscribe(posts => {
                this.postLoading = false;
                const count = posts.length;
                if (count > 0) {
                    // Post process after getting posts
                    posts.forEach(post =>  {
                        post.remarks = []; // Make remarks instead of post's comments, because comments is count of comments now
                        post.newComment = ''; // New post
                        post.page = 0; // Page number of comments
                        post.isCommentsShow = false; // visibility of comments section
                        post.commentsLoading = false;
                    });
                    if (isFirstCall) {
                        this.posts = [];
                    }
                    this.posts.push(...posts);
                }

                switch (true) {
                    case (count === 0):
                    case (count > 0 && count < 10):
                        this.canLoadPosts = false;
                        break;
                    default:
                        this.canLoadPosts = true;
                        this.page++;
                        break;
                }

            }, err => {
                this.postLoading = false;
            });
        }

    }

    getPinnedPosts() {
        let type;

        if (this.lvl) {
            type = this.lvl;
        } else {
            type = ['client', 'ext'].includes(this.user.lvl) ? this.user.lvl : 'main';
        }

        this.homeService.getPinnedPosts(type, this.otherId || 0).subscribe(posts => {
            this.pinnedPosts = posts;
        });
    }

    getComments(post) {
        post.commentsLoading = true;
        this.homeService.getComments(post.id, post.page).subscribe(comments => {
            post.commentsLoading = false;
            post.remarks.push(...comments);
            post.page++;
        }, err => {
            post.commentsLoading = false;
            this.toastr.error('Something is wrong!');
        });
    }

    editPost(post) {
        this.dialogRef = this.dialog.open(EditPostDialogComponent, {
            disableClose: false,
            panelClass: 'post-form-dialog',
            data: post
        });

        this.dialogRef.afterClosed().subscribe(res => {
            if (res) {
                post.content = res.content;
                post.thumb = res.thumb;
                post.link = res.link;
            }
        });
    }

    editComment(comment) {
        this.dialogRef = this.dialog.open(EditCommentDialogComponent, {
            disableClose: false,
            panelClass: 'comment-form-dialog',
            data: comment
        });

        this.dialogRef.afterClosed().subscribe(res => {
            if (res) {
                comment.content = res.content;
            }
        });
    }

    /**
     * Show comments and load comments by page
     */
    initComments(post) {
        if (post.isCommentsShow) { return; }
        if (post.comments > 0 && post.page === 0) {
            this.getComments(post);
        }
        post.isCommentsShow = true;
    }

    deletePost(post) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.homeService.deletePost(post.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    const index = _.findIndex(this.posts, ['id', post.id]);
                    this.posts.splice(index, 1);
                });
            }
        });
    }

    deleteComment(post, comment) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.homeService.deleteComment(comment.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    const index = _.findIndex(post.remarks, ['id', comment.id]);
                    post.remarks.splice(index, 1);
                    post.comments--;
                });
            }
        });
    }

    likePost(post) {
        post.liked = post.liked === 0 ? 1 : 0;
        if (post.liked) {
            post.likes++;
        } else {
            post.likes--;
        }
        this.homeService.likePost(post.id, post.liked).subscribe(res => {});
    }

    likeComment(comment) {
        comment.liked = comment.liked === 0 ? 1 : 0;
        if (comment.liked) {
            comment.likes++;
        } else {
            comment.likes--;
        }
        this.homeService.likeComment(comment.id, comment.liked).subscribe(res => {});
    }

    approvePost(post) {
        post.approved = post.approved === 0 ? 1 : 0;
        this.homeService.approvePost(post.id, post.approved).subscribe(
            res => {
                //this.toastr.success(res.message);
            },
            err => {
                this.toastr.error(err.message);
                post.approved = post.approved === 0  ? 1 : 0; // Roll back
            });
    }

    approveComment(comment) {
        comment.approved = comment.approved === 0 ? 1 : 0;
        this.homeService.approveComment(comment.id, comment.approved).subscribe(
            res => {
                //this.toastr.success(res.message);
            },
            err => {
                this.toastr.error(err.message);
                comment.approved = comment.approved === 0 ? 1 : 0; // Roll back
            });
    }

    addComment(post) {
        const content = _.trim(post.newComment);
        if (_.isEmpty(content)) { return; }
        this.homeService.createComment(post.id, content).subscribe(comment => {
            comment = {
                ...comment,
                name: this.user.name,
                ppic_a: this.user.ppic_a,
                likes: 0,
                liked: 0
            };
            post.remarks.unshift(comment);
            post.newComment = '';
            post.comments++;
        }, err => {
            this.toastr.error(err.message);
        });
    }

    addPost() {
        const content = _.trim(this.newPost);
        if (_.isEmpty(content)) { return; }
        this.spinner.show();
        if (this.file) { // If posting a file
            const formData = new FormData();
            formData.append('file', this.file, this.file.name);
            formData.append('ptype', this.lvl || PostType.Main);
            formData.append('content', content);
            if (this.otherId) {
                formData.append('other_id', `${this.otherId}`);
            }
            this.homeService.createPost(formData).subscribe(post => {
                this.spinner.hide();
                this.addToPosts(post);
            }, err => {
                this.spinner.hide();
                this.displayError(err);
            });
        } else { // If posting text
            let body: any = {
                content,
                ptype: this.lvl || PostType.Main
            };
            if (this.otherId) {
                body.other_id = this.otherId;
            }
            this.homeService.createPost(body).subscribe(post => {
                this.spinner.hide();
               this.addToPosts(post);
            }, err => {
                this.spinner.hide();
                this.displayError(err);
            });
        }
    }

    pinPost(post) {
        const pinned = post.pinned === 0 ? 1 : 0;
        if (pinned === 0) { // Unpin
            this.homeService.pinPost(post.id, 0).subscribe(res => {
                post.pinned = pinned;
                //this.toastr.success(res.message);
                const index = _.findIndex(this.pinnedPosts, ['post_id', post.id]);
                this.pinnedPosts.splice(index, 1);
            });
        } else { // Pin
            this.dialogRef = this.dialog.open(PinPostDialogComponent, {
                disableClose: false,
                panelClass: 'pin-post-dialog'
            });
            this.dialogRef.afterClosed().subscribe(title => {
                if (title) {
                    this.homeService.pinPost(post.id, 1, title).subscribe(res => {
                        post.pinned = pinned;
                        //this.toastr.success(res.message);
                        this.pinnedPosts.push({
                            title,
                            post_id: res.data.post_id
                        });
                    });
                }
            });
        }
    }

    private addToPosts(post: any) {
        const file = post.file;
        if (file) { // If post uploaded with a file
        }

        post = {
            ...post,
            ppic_a: this.user.ppic_a,
            comments: 0,
            likes: 0,
            liked: 0,
            remarks: [],
            newComment: '',
            page: 0, // For comments
            isCommentsShow: false
        };
        this.posts.unshift(post);
        this.newPost = '';
        this.preview = null;
        this.file = null;
    }

    onUploadFile(event) {
        const files = event.target.files;
        this.file = files[0];
        if (this.file && this.file.size / (1024 * 1024) > 10) {
            this.toastr.error('Maximum file size to upload is 10Mb.');
            return;
        }
        this.preview = null;
        if (files && files[0]) {
            if (_.startsWith(this.file.type, 'video') || _.startsWith(this.file.type, 'image')) {
                this.readURL(this.file);
            } else {
                this.preview = {}; // For document upload
            }
        }
    }

    private readURL(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.preview = reader.result;
        };

        reader.readAsDataURL(file);
    }

    removeFile() {
        this.file = null;
        this.preview = null;
    }

    getFileType(url: string) {
        if (!url) { return; }
        let type;
        switch (true) {
            case (_.endsWith(url, 'mp4')):
                type = 'video';
                break;
            default:
                type = 'other';
                break;
        }
        return type;
    }

    openPinPostDialog(postId) {
        postId = parseInt(postId, 10);
        this.dialogRef = this.dialog.open(PostDialogComponent, {
            disableClose: true,
            panelClass: 'post-dialog',
            data: { 
                postId, 
                user: this.user,
                lvl: this.lvl
            }
        });
        this.dialogRef.afterClosed().subscribe(mode => {
            if (mode === 'update') {
                this.getPinnedPosts();
                const index = _.findIndex(this.posts, ['id', postId]);
                if (index > -1) { // If pinned post is already displayed, update post
                    this.homeService.getPost(postId).subscribe(post => {
                        post = {
                            ...post,
                            remarks: [],
                            newComment: '',
                            page: 0,
                            isCommentsShow: false,
                            commentsLoading: false
                        };
                        this.posts[index] = post;
                    });
                }
            } else { // mode === 'delete'
                const index = _.findIndex(this.posts, ['id', postId]);
                if (index > -1) {
                    this.posts.splice(index, 1);
                }
                const pinIndex = _.findIndex(this.pinnedPosts, ['post_id', postId]);
                if (index > -1) {
                    this.pinnedPosts.splice(pinIndex, 1);
                }
            }
        });
    }

    isNumeric(value: any): boolean {
        return !isNaN(value);
    }

    isUrl(value: any): boolean {
        return value && (value.startsWith('http://') || value.startsWith('https://'));
    }

    doAction(activity: any): void {
        if (!activity.action) return;
        switch (activity.action) {
            case 'calendar':
                this.tabService.openTab(TAB.SCHEDULE_CALENDAR_TAB);
                break;
            case 'shift':
                this.openShiftTab(activity.other_id);
                break;
            case 'profile':
                this.openProfileTab(activity.other_id);
                break;
            case 'completed_registrants':
                this.openCompletedRegistrants(activity)
                break;
            case 'report':
                this.openReport(activity.data)
                break;

        }
    }

    async openProfileTab(userId: number): Promise<any> {
        try {
            this.spinner.show();
            const user = await this.userService.getUser(userId).toPromise();
            const tab = new Tab(`${user.fname} ${user.lname}`, 'usersProfileTpl', `users/user/${user.id}`, user);
            this.tabService.openTab(tab);
        } catch (e) {
            this.displayError(e);
        } finally {
            this.spinner.hide();
        }
    }

    async openShiftTab(shiftId: number): Promise<any> {
        if (!shiftId) return;
        try {
            this.spinner.show();
            const shift = await this.scheduleService.getShift(shiftId);
            if (shift.type === 'g') {
                if (['owner', 'admin'].includes(this.user.lvl)) {
                  const tab = new Tab(
                    shift.title,
                    'adminShiftGroupTpl',
                    `admin-shift/group/${shift.id}`,
                    { id: shift.id }
                  );
                  this.tabService.openTab(tab);
                } else {
                  return;
                }
            } else {
                const id = shift.id;
                let template = 'staffShiftTpl';
                let url = `staff/shift/${id}`;
            
                if (['owner', 'admin'].includes(this.user.lvl)) {
                  template = 'adminShiftTpl';
                  url = `admin/shift/${id}`;
                }
                const tab = new Tab(shift.title, template, url, { id, url });
                this.tabService.openTab(tab);
            }
        } catch (e) {
            this.displayError(e);
        } finally {
            this.spinner.hide();
        }
    }

    openReport(report) {
        const tab = new Tab(
            report.rname,
            'quizTpl',
            `home/report/${report.other_id}`,
            {
                ...report
            }
        );
        this.tabService.openTab(tab);
    }

    openCompletedRegistrants(activity) {
        if (activity.action === 'completed_registrants') {
            const tab = _.cloneDeep(TAB.USERS_TAB);
            tab.data = { selectedTypeFilter: 'utype:=:complete' };
            this.tabService.closeTab(tab.url);
            this.tabService.openTab(tab);
        }
    }

    private displayError(error) {
        const errors = error.error.errors;
        Object.keys(errors).forEach(e => {
            this.toastr.error(errors[e]);
        });
    }

}
