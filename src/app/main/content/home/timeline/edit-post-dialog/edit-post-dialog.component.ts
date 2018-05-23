import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../home.service';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';

@Component({
    selector: 'app-edit-post-dialog',
    templateUrl: './edit-post-dialog.component.html',
    styleUrls: ['./edit-post-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPostDialogComponent implements OnInit {

    post;
    file;
    preview;
    delete_file = 0; // Check if already uploaded file should be deleted

    constructor(
        public dialogRef: MatDialogRef<EditPostDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toastr: ToastrService,
        private spinner: CustomLoadingService,
        private homeService: HomeService
    ) {
        this.post = _.cloneDeep(this.data);
    }

    ngOnInit() {

    }

    savePost() {
        const content = this.post.content.trim();
        if (!content) { return; }
        this.spinner.show();
        const post = new FormData();
        post.append('content', content);
        post.append('delete_file', this.delete_file.toString());
        if (this.file) {
            post.append('file', this.file, this.file.name);
        }
        this.homeService.updatePost(this.post.id, post).subscribe(newPost => {
            this.spinner.hide();
            //this.toastr.success('Saved');
            this.dialogRef.close(newPost);
        }, err => {
            this.spinner.hide();
            this.displayError(err);
        });
    }

    onUploadFile(event) {
        this.delete_file = 1;
        const files = event.target.files;
        this.file = files[0];
        if (this.file && this.file.size / (1024 * 1024) > 10) {
            this.toastr.error('Maximum file size to upload is 10Mb.');
            return;
        }
        this.post.thumb = null;
        this.preview = null;
        if (this.file) {
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

    removeFile() {
        this.file = null;
        this.preview = null;
    }

    deleteFile() {
        this.delete_file = 1;
        this.post.thumb = null;
    }

    private displayError(error) {
        const errors = error.error.errors;
        Object.keys(errors).forEach(e => {
            this.toastr.error(errors[e]);
        });
    }

}
