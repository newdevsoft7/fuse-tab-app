import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { HomeService } from '../../home.service';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { EditCommentDialogComponent } from '../edit-comment-dialog/edit-comment-dialog.component';
import { PinPostDialogComponent } from '../pin-post-dialog/pin-post-dialog.component';
import { EditPostDialogComponent } from '../edit-post-dialog/edit-post-dialog.component';

enum PostType {
    Main = 'main',
    Client = 'client',
    Ext = 'ext'
}

@Component({
    selector: 'app-post-dialog',
    templateUrl: './post-dialog.component.html',
    styleUrls: ['./post-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PostDialogComponent implements OnInit {

    post: any;
    user: any;
    canLoadPosts = false; // Ability to load more posts

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<PostDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private homeService: HomeService,
        private toastr: ToastrService
    ) {
        this.user = this.data.user;
    }

    ngOnInit() {
        this.homeService.getPost(this.data.postId).subscribe(post => {
            this.post = {
                ...post,
                remarks: [], // Make remarks instead of post's comments, because comments is count of comments now
                page: 0, // Page number of comments
                isCommentsShow: false, // visibility of comments section
                commentsLoading: false,
            };
        });
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

    editPost() {
        const dialogRef = this.dialog.open(EditPostDialogComponent, {
            disableClose: false,
            panelClass: 'post-form-dialog',
            data: this.post
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.post.content = res.content;
                this.post.thumb = res.thumb;
                this.post.link = res.link;
            }
        });
    }

    deletePost() {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.homeService.deletePost(this.post.id).subscribe(res => {
                    this.toastr.success(res.message);
                    // TODO - Remove post in timeline
                    this.dialogRef.close('delete');
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
        this.homeService.likePost(post.id, post.liked).subscribe(res => { });
    }

    likeComment(comment) {
        comment.liked = comment.liked === 0 ? 1 : 0;
        if (comment.liked) {
            comment.likes++;
        } else {
            comment.likes--;
        }
        this.homeService.likeComment(comment.id, comment.liked).subscribe(res => { });
    }

    getComments() {
        this.post.commentsLoading = true;
        this.homeService.getComments(this.post.id, this.post.page).subscribe(comments => {
            this.post.commentsLoading = false;
            this.post.remarks.push(...comments);
            this.post.page++;
        }, err => {
            this.post.commentsLoading = false;
            this.toastr.error('Something is wrong!');
        });
    }

    initComments() {
        if (this.post.isCommentsShow) { return; }
        if (this.post.comments > 0 && this.post.page === 0) {
            this.getComments();
        }
        this.post.isCommentsShow = true;
    }

    addComment() {
        const content = _.trim(this.post.newComment);
        if (_.isEmpty(content)) { return; }
        this.homeService.createComment(this.post.id, content).subscribe(comment => {
            comment = {
                ...comment,
                name: this.user.name,
                ppic_a: this.user.ppic_a,
                likes: 0,
                liked: 0
            };
            this.post.remarks.unshift(comment);
            this.post.newComment = '';
            this.post.comments++;
        }, err => {
            this.toastr.error(err.message);
        });
    }

    editComment(comment) {
        const dialogRef = this.dialog.open(EditCommentDialogComponent, {
            disableClose: false,
            panelClass: 'comment-form-dialog',
            data: comment
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                comment.content = res.content;
            }
        });
    }

    deleteComment(comment) {
        this.homeService.deleteComment(comment.id).subscribe(res => {
            this.toastr.success(res.message);
            const index = _.findIndex(this.post.remarks, ['id', comment.id]);
            this.post.remarks.splice(index, 1);
            this.post.comments--;
        });
    }

    approveComment(comment) {
        comment.approved = comment.approved === 0 ? 1 : 0;
        this.homeService.approveComment(comment.id, comment.approved).subscribe(
            res => {
                this.toastr.success(res.message);
            },
            err => {
                this.toastr.error(err.message);
                comment.approved = comment.approved === 0 ? 1 : 0; // Roll back
            });
    }

    approvePost() {
        this.post.approved = this.post.approved === 0 ? 1 : 0;
        this.homeService.approvePost(this.post.id, this.post.approved).subscribe(
            res => {
                this.toastr.success(res.message);
            },
            err => {
                this.toastr.error(err.message);
                this.post.approved = this.post.approved === 0 ? 1 : 0; // Roll back
            });
    }

    pinPost() {
        const pinned = this.post.pinned === 0 ? 1 : 0;
        if (pinned === 0) { // Unpin
            this.homeService.pinPost(this.post.id, 0).subscribe(res => {
                this.post.pinned = pinned;
                this.toastr.success(res.message);
            });
        } else { // Pin
            const dialogRef = this.dialog.open(PinPostDialogComponent, {
                disableClose: false,
                panelClass: 'pin-post-dialog'
            });
            dialogRef.afterClosed().subscribe(title => {
                if (title) {
                    this.homeService.pinPost(this.post.id, 1, title).subscribe(res => {
                        this.post.pinned = pinned;
                        this.toastr.success(res.message);
                    });
                }
            });
        }
    }

    closeDialog() {
        this.dialogRef.close('update');
    }

}
