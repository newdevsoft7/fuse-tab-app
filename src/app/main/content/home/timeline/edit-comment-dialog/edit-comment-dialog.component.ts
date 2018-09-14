import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../home.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-edit-comment-dialog',
    templateUrl: './edit-comment-dialog.component.html',
    styleUrls: ['./edit-comment-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditCommentDialogComponent implements OnInit {

    comment;

    constructor(
        public dialogRef: MatDialogRef<EditCommentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private homeService: HomeService,
        private scMessageService: SCMessageService
    ) {
        this.comment = _.cloneDeep(this.data);
    }

    ngOnInit() {
    }

    saveComment() {
        const content = this.comment.content.trim();
        if (!content) { return; }
        this.homeService.updateComment(this.comment.id, this.comment.content).subscribe(newComment => {
            //this.toastr.success('Saved');
            this.dialogRef.close(newComment);
        }, err => {
            this.scMessageService.error(err);
        });
    }

}
