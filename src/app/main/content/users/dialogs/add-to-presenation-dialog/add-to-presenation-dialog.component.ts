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
    isCreatePresentation = false;
    users: number[];
    name: string;
    loaded = false;

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
        } finally {
            this.loaded = true;
        }
    }

    async save() {
        try {
            let presentationId;
            if (this.isCreatePresentation) {
                const presentation = await this.userService.createPresentation({
                    name: this.name,
                    users: this.users
                });
                presentationId = presentation.id;
            } else {
                await this.userService.addUsersToPresentation(this.presentationId, this.users);
                presentationId = this.presentationId;
            }
            this.dialogRef.close(false);
            this.actionService.selectedPresentationId$.next(presentationId);
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
