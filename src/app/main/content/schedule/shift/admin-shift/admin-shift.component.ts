import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatTab, MatTabChangeEvent, MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { AdminShiftMapComponent } from './map/map.component';
import { AdminShiftStaffComponent } from './staff/staff.component';
import { TabService } from '../../../../tab/tab.service';
import { Tab } from '../../../../tab/tab';
import { ActionService } from '../../../../../shared/services/action.service';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';

export enum TAB {
    Staff = 'Staff',
    Bill = 'Bill',
    Reports = 'Reports & Uploads',
    Attachements = 'Attachments',
    Map = 'Map'
}

@Component({
    selector: 'app-admin-shift',
    templateUrl: './admin-shift.component.html',
    styleUrls: ['./admin-shift.component.scss']
})
export class AdminShiftComponent implements OnInit, OnDestroy {

    @Input() data;
    @ViewChild('staffTab') staffTab: AdminShiftStaffComponent;
    @ViewChild('mapTab') mapTab: AdminShiftMapComponent;

    showMoreBtn = true;

    usersToInviteSubscription: Subscription;
    usersToSelectSubscription: Subscription;
    selectedTabIndex: number = 0; // Set staff tab as initial tab

    shiftData: any; // For edit tracking & work areas

    get id() {
        return this.data.id;
    }

    get url() {
        return this.data.url;
    }

    currentUser: any;
    shift: any;
    timezones = [];
    notes; // For Shift notes tab
    settings: any = {};
    clients: any[] = [];

    constructor(
        private tokenStorage: TokenStorage,
        private toastr: ToastrService,
        private userService: UserService,
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private actionService: ActionService,
        private spinner: CustomLoadingService,
        private dialog: MatDialog
    ) {
        // Invite Users to Role
        this.usersToInviteSubscription = this.actionService.usersToInvite.subscribe(
            ({ shiftId, userIds, filters, role, inviteAll }) => {
                if (this.shift.id === shiftId) {
                    this.selectedTabIndex = 0; // Set staff tab active
                        this.staffTab.inviteStaffs({ userIds, filters, role, inviteAll });
                }
            });
        // add Users to Role
        this.usersToSelectSubscription = this.actionService.usersToSelect.subscribe(
            ({ shiftId, userIds, role }) => {
                if (this.shift.id === shiftId) {
                    this.selectedTabIndex = 0; // Set staff tab active
                        this.staffTab.selectStaffs({ userIds, role });
                }
            });
    }

    ngOnInit() {
        this.currentUser = this.tokenStorage.getUser();
        this.settings = this.tokenStorage.getSettings();
        this.fetch();

        this.scheduleService.getTimezones()
            .subscribe(res => {
                Object.keys(res).forEach(key => {
                    this.timezones.push({ value: key, label: res[key] });
                });
            });

        // Get Tracking Categories & Options
        this.scheduleService.getShiftsData().subscribe(res => {
            this.shiftData = res;
        });

        // Get Clients
        this.scheduleService.getClients('').subscribe(res => {
            this.clients = res;
        })

    }

    ngOnDestroy() {
        this.usersToInviteSubscription.unsubscribe();
        this.usersToSelectSubscription.unsubscribe();
    }

    deleteShift() {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.scheduleService.deleteShift(this.shift.id);
                    this.toastr.success(res.message);
                    this.tabService.closeTab(this.url);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    invite() {
        const roles = this.shift.shift_roles.map(v => {
            return {
                id: v.id,
                name: v.rname
            };
        });
        if (roles.length === 0) {
            this.toastr.error('There are no roles in the shift. Please add a role first.');
            return;
        }
        const data = {
            roles,
            shiftId: this.id,
            invite: true,
            tab: `admin/shift/${this.shift.id}`,
            filters: [],
            title: this.shift.title
        };

        this.tabService.closeTab('users');
        const tab = new Tab('Users', 'usersTpl', 'users', data);

        this.tabService.openTab(tab);
    }

    toggleMoreBtn() {
        this.showMoreBtn = !this.showMoreBtn;
    }

    selectedTabChange(event: MatTabChangeEvent) {
        switch (event.tab.textLabel) {
            case TAB.Map:
                this.mapTab.refreshMap();
                break;

            default:
                break;
        }
    }

    toggleFlag(flag) {
        const value = flag.set === 1 ? 0 : 1;
        this.scheduleService.setShiftFlag(this.shift.id, flag.id, value)
            .subscribe(res => {
                flag.set = value;
            });
    }

    toggleLive() {
        const live = this.shift.live === 1 ? 0 : 1;
        this.scheduleService.publishShift(this.shift.id, live)
            .subscribe(res => {
                this.shift.live = live;
                this.toastr.success(res.message);
            });
    }

    toggleLock() {
        const lock = this.shift.locked === 1 ? 0 : 1;
        this.scheduleService.lockShift(this.shift.id, lock)
            .subscribe(res => {
                this.shift.locked = lock;
                this.toastr.success(res.message);
            });
    }

    onAddressChanged(address) {
        this.shift.address = address;
    }

    onContactChanged(contact) {
        this.shift.contact = contact;
    }

    onGenericLocationChanged(genericLocation) {
        this.shift.generic_location = genericLocation;
    }

    onGenericTitleChanged(genericTitle) {
        this.shift.generic_title = genericTitle;
    }

    onTitleChanged(title) {
        this.shift.title = title;
    }

    onPeriodChanged({ start, end, timezone }) {
        this.shift.shift_start = start;
        this.shift.shift_end = end;
        this.shift.timezone = timezone;
    }

    onManagersChanged(managers: any[]) {
        this.shift.managers = managers;
    }

    addRole() {
        const url = `shift/${this.shift.id}/role-edit`;
        const shift = this.shift;
        const tab = new Tab(
            `Add Role (1 shift)`,
            'shiftRoleEditTpl',
            url,
            { shift, url });
        this.tabService.closeTab(url);
        this.tabService.openTab(tab);
    }

    private async fetch() {
        try {
            this.shift = await this.scheduleService.getShift(this.id);
            this.notes = _.clone(this.shift.notes);
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong while fetching events.');
        }
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.message);
        }
    }

}
