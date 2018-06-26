import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TabService } from '../../../../../tab/tab.service';
import { UserService } from '../../../user.service';
import { ToastrService } from 'ngx-toastr';
import { Tab } from '../../../../../tab/tab';

@Component({
    selector: 'app-forms-dialog',
    templateUrl: './forms-dialog.component.html',
    styleUrls: ['./forms-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentFormsDialogComponent implements OnInit {

    forms: any[] = [];
    userId: number;

    constructor(
        public dialogRef: MatDialogRef<DocumentFormsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private tabService: TabService,
        private userService: UserService,
        private toastr: ToastrService
    ) {
        this.userId = this.data.userId;
    }

    async ngOnInit() {
        try {
            this.forms = await this.userService.getAvailableForms(this.userId);
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
    }

    openForm(form) {
        const tab = new Tab(
            form.fname,
            'formTpl',
            `profile/${this.userId}/document/${form.other_id}`,
            form
        );
        this.tabService.openTab(tab);
        this.dialogRef.close();
    }

}
