import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../../../../users/user.service';
import { ActionService } from '../../../../../../../../shared/services/action.service';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../../../../schedule.service';
import { TabService } from '../../../../../../../tab/tab.service';
import { TAB } from '../../../../../../../../constants/tab';
import { TabComponent } from '../../../../../../../tab/tab/tab.component';
import { SCMessageService } from '../../../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-shift-add-users-to-presentation-dialog',
    templateUrl: './add-users-to-presentation-dialog.component.html',
    styleUrls: ['./add-users-to-presentation-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftAddUsersToPresentationDialogComponent implements OnInit {

    user: any;
    role: any;
    presentations: any[];
    presentationId;
    loaded = false;
    userType;

    userTypes = [
        { value: 'selected', label: 'Selected' },
        { value: 'applicants', label: 'Applied' },
        { value: 'invited', label: 'Invited' }
    ];

    constructor(
        public dialogRef: MatDialogRef<ShiftAddUsersToPresentationDialogComponent>,
        private userService: UserService,
        private actionService: ActionService,
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private scMessageService: SCMessageService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.user = data.user;
        this.role = data.role;
    }

    async ngOnInit() {
        try {
            this.presentations = await this.userService.getPresentations();
            this.presentationId = this.actionService.selectedPresentationId;
        } catch (e) {
            this.scMessageService.error(e);
        } finally {
            this.loaded = true;
        }
    }

    async save() {
        try {
            let presentationId;
            if (this.user) {
                await this.userService.addUserToPresentation(this.presentationId, this.user.user_id);
                presentationId = this.presentationId;
            }
    
            if (this.role) {
                const users = await this.scheduleService.getRoleStaffs(this.role.id, this.userType).toPromise();
                if (users.length > 0) {
                    await this.userService.addUsersToPresentation(this.presentationId, users.map(u => u.user_id));
                    presentationId = this.presentationId;
                }
            }

            this.dialogRef.close(false);
            if (presentationId) {
                this.actionService.selectedPresentationId$.next(presentationId);
                const index = this.tabService.openTabs.findIndex((tab: TabComponent) => tab.url.indexOf('users/presentations') > -1);
                if (index < 0) {
                    this.tabService.openTab(TAB.USERS_PRESENTATIONS_TAB);
                } else {
                    this.tabService.selectTab(this.tabService.openTabs[index]);
                }
            }
        } catch (e) {
            this.scMessageService.error(e);
        }
        
    }

    disabled() {
        if (this.user) {
            return this.presentationId ? false : true;
        }

        if (this.role) {
            return !this.presentationId || !this.userType ? true : false; 
        }
    }

}
