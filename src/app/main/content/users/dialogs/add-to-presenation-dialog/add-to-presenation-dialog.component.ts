import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../user.service';
import { ActionService } from '../../../../../shared/services/action.service';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../../tab/tab.service';
import { TabComponent } from '../../../../tab/tab/tab.component';
import { TAB } from '../../../../../constants/tab';

@Component({
    selector: 'app-add-to-presenation-dialog',
    templateUrl: './add-to-presenation-dialog.component.html',
    styleUrls: ['./add-to-presenation-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AddToPresenationDialogComponent implements OnInit {

    presentations: any[] = [];
    presentationId: any;
    users: number[];
    name: string;
    presentation: any;

    constructor(
        public dialogRef: MatDialogRef<AddToPresenationDialogComponent>,
        private userService: UserService,
        private actionService: ActionService,
        private toastr: ToastrService,
        private tabService: TabService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.users = data.users;
    }

    async ngOnInit() {
        try {
            this.presentations = await this.userService.getPresentations();
            this.presentationId = this.actionService.selectedPresentationId;
        } catch (e) {
            this.displayError(e);
        }
    }

    async createPresentation() {
        try {
            this.presentation = await this.userService.createPresentation({
                name: this.name,
                users: this.users
            });
        } catch (e) {
            this.displayError(e);
        }
    }

    async save() {
        if (this.presentation) { // if presentation is created
            this.dialogRef.close(false);
            this.actionService.selectedPresentationId$.next(this.presentation.id);
            const index = this.tabService.openTabs.findIndex((tab: TabComponent) => tab.url.indexOf('users/presentations') > -1);
            if (index < 0) {
                this.tabService.openTab(TAB.USERS_PRESENTATIONS_TAB);
            } else {
                this.tabService.selectTab(this.tabService.openTabs[index]);
            }
        } else {
            if (!this.presentationId) { return; }
            try {
                await this.userService.addUsersToPresentation(this.presentationId, this.users);
                this.dialogRef.close(false);
                this.actionService.selectedPresentationId$.next(this.presentationId);
                const index = this.tabService.openTabs.findIndex((tab: TabComponent) => tab.url.indexOf('users/presentations') > -1);
                if (index < 0) {
                    this.tabService.openTab(TAB.USERS_PRESENTATIONS_TAB);
                } else {
                    this.tabService.selectTab(this.tabService.openTabs[index]);
                }
            } catch (e) {
                this.displayError(e);
            }
        }
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
