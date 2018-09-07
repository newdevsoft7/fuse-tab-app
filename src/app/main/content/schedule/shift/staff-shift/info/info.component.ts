import {
    Component, OnInit,
    ViewEncapsulation, Input,
    OnDestroy,
    EventEmitter,
    Output
} from '@angular/core';

import {
    MatDialog} from '@angular/material';

import { ToastrService } from 'ngx-toastr';

import { ScheduleService } from '../../../schedule.service';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';

import * as _ from 'lodash';

// Action Dialogs
import { StaffShiftReplaceDialogComponent } from './dialogs/replace-dialog/replace-dialog.component';
import { StaffShiftConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { StaffShiftPayItemDialogComponent } from './dialogs/pay-item-dialog/pay-item-dialog.component';
import { StaffShiftApplyDialogComponent } from './dialogs/apply-dialog/apply-dialog.component';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';
import { StaffShiftCheckInOutDialogComponent } from './dialogs/check-in-out-dialog/check-in-out-dialog.component';
import { StaffShiftCompleteDialogComponent } from './dialogs/complete-dialog/complete-dialog.component';
import { TabService } from '../../../../../tab/tab.service';
import { StaffShiftQuizDialogComponent } from './dialogs/quiz-dialog/quiz-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../../../shared/services/connector.service';
import { TabComponent } from '../../../../../tab/tab/tab.component';
import { FuseInfoDialogComponent } from '../../../../../../core/components/info-dialog/info-dialog.component';
import { Tab } from '../../../../../tab/tab';

enum Action {
    apply = 'apply',
    cancel_application = 'cancel_application',
    not_available = 'not_available',
    confirm = 'confirm',
    replace = 'replace',
    cancel_replace = 'cancel_replace',
    cancel_replace_standby = 'cancel_replace_standby',
    check_in = 'check_in',
    check_out = 'check_out',
    complete = 'complete',
    expenses = 'expenses',
    invoice = 'invoice',
    view_invoice = 'view_invoice',
    view_pay = 'view_pay',
    reports = 'reports',
    uploads = 'uploads'
}

@Component({
    selector: 'app-staff-shift-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftInfoComponent implements OnInit, OnDestroy {

    @Input() shift;

    dialogRef: any;
    @Output() shiftChanged = new EventEmitter;

    readonly Action = Action;
    settings: any = {};

    quizEventSubscription: Subscription;

    constructor(
        private scheduleService: ScheduleService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private tabService: TabService,
        private connectorService: ConnectorService
    ) { }

    ngOnInit() {
        this.settings = this.tokenStorage.getSettings();
        this.quizEventSubscription = this.connectorService.currentQuizTab$.subscribe((tab: TabComponent) => {
            if (!tab) { return; }
            const id = tab.data.other_id;
            if (tab && tab.url === `staff-shift/reports/${id}`) {
                // const role = tab.data.role;
                // const index = this.shift.shift_roles.findIndex(v => v.id === role.id);
                // if (index > -1) {
                //     const action = tab.data.action;
                //     this.doAction(action, role);
                // }
                this.tabService.closeTab(tab.url);
                this.shiftChanged.next(true);
            } else if (tab && tab.url === `staff-shift/quiz/${id}`) {
                const role = tab.data.role;
                const index = this.shift.shift_roles.findIndex(v => v.id === role.id);
                if (index > -1) {
                    const score = tab.data.score; // assume that quizconnect returns score
                    this.openScoreDialog(score);
                    const quiz = this.shift.shift_roles[index].quizs.find(v => v.other_id === id);
                    if (quiz) {
                        quiz.completed_score = score;
                        if (quiz.required_score > 0) {
                            quiz.required = score >= quiz.required_score ? 0 : 1;
                        } else {
                            quiz.required = 0;
                        }
                    }
                }
                this.tabService.closeTab(tab.url);
            }
        });
    }

    openScoreDialog(score) {
        if (_.isNil(score)) {
            return;
        } else {
            const dialogRef = this.dialog.open(FuseInfoDialogComponent, {
                disableClose: false,
                panelClass: 'fuse-info-dialog'
            });
            dialogRef.componentInstance.title = 'QuizConnect';
            dialogRef.componentInstance.message = `Your score: ${Math.round(score)}%`;
            dialogRef.afterClosed().subscribe(() => { });
        }
    }

    ngOnDestroy() {
        this.quizEventSubscription.unsubscribe();
    }

    openPayItemDialog(payItems) {
        this.dialogRef = this.dialog.open(StaffShiftPayItemDialogComponent, {
            data: { payItems }
        });
        this.dialogRef.afterClosed().subscribe(_ => { });
    }

    sum(payItems: any[]) {
        return payItems.reduce((ac, item) => ac + item.total, 0);
    }

    getStyle(action) {
        let style;
        switch (action) {
            case Action.confirm:
            case Action.apply:
                style = 'mat-accent-bg'
                break;

            case Action.replace:
            case Action.not_available:
                style = 'mat-warn-bg';
                break;


            default:
                style = 'mat-primary-50-bg';
                break;
        }

        return style;
    }

    openQuizDialog(role, quizs) {
        const dialogRef = this.dialog.open(StaffShiftQuizDialogComponent, {
            disableClose: false,
            panelClass: 'staff-shift-quiz-dialog',
            data: {
                role,
                quizs
            }
        });
        dialogRef.afterClosed().subscribe(_ => { });
    }

    doAction(action, role) {
        let dialogRef;
        let quizs;
        let tab: Tab;

        switch (action) {
            case Action.apply:
                quizs = role.quizs.filter(v => v.required === 1);
                if (role.show_quizs === 1 && quizs.length > 0) {
                    this.openQuizDialog(role, quizs);
                } else {
                    this.dialogRef = this.dialog.open(StaffShiftApplyDialogComponent, {
                        panelClass: 'staff-shift-apply-dialog',
                        data: {
                            forms: this.shift.forms_apply,
                            shift_id: this.shift.id
                        }
                    });
                    this.dialogRef.afterClosed().subscribe(reason => {
                        if (!reason) return;
                        this.scheduleService.applyShiftRole(role.id, reason)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                                role.role_staff_id = res.id;
                            }, err => this.displayError(err));
                    });
                }
                break;

            case Action.cancel_application:
                dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                    disableClose: false
                });
                dialogRef.componentInstance.confirmMessage = 'Really cancel your application?';
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.applyCancelShiftRole(roleStaffId)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                                delete role.role_staff_id;
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.not_available:
                this.scheduleService.notAvailableShiftRole(role.id).subscribe(res => {
                    //this.toastr.success(res.message);
                    role.message = res.role_message;
                    role.actions = [...res.actions];
                    role.role_staff_id = res.id;
                }, err => this.displayError(err));
                break;

            case Action.confirm:
                quizs = role.quizs.filter(v => v.required === 1);
                if (role.show_quizs === 1 && quizs.length > 0) {
                    this.openQuizDialog(role, quizs);
                } else {
                    this.dialogRef = this.dialog.open(StaffShiftConfirmDialogComponent, {
                        data: {
                            title: 'Really confirm this role?',
                            heading: this.settings.shift_msg_confirmation,
                            forms: this.shift.forms_confirm,
                            surveys: role.surveys,
                            showSurveys: role.show_surveys,
                            shift_id: this.shift.id
                        }
                    });
                    this.dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            const roleStaffId = role.role_staff_id;
                            this.scheduleService.confirmStaffSelection(roleStaffId)
                                .subscribe(res => {
                                    //this.toastr.success(res.message);
                                    role.message = res.role_message;
                                    role.actions = [...res.actions]
                                }, err => this.displayError(err));
                        }
                    });
                }
                break;

            case Action.replace:
                this.dialogRef = this.dialog.open(StaffShiftReplaceDialogComponent, {
                    panelClass: 'staff-shift-replace-dialog'
                });
                this.dialogRef.afterClosed().subscribe(reason => {
                    if (reason) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.replaceShiftRole(roleStaffId, reason)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions];
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.cancel_replace:
                dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                    disableClose: false
                });
                dialogRef.componentInstance.confirmMessage = 'Really cancel your application?';
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        this.scheduleService.replaceCancelShiftRole(roleStaffId)
                            .subscribe(res => {
                                //this.toastr.success(res.message);
                                role.message = res.role_message;
                                role.actions = [...res.actions]
                            }, err => this.displayError(err));
                    }
                });
                break;

            case Action.cancel_replace_standby:

                break;

            case Action.check_in:
                dialogRef = this.dialog.open(StaffShiftCheckInOutDialogComponent, {
                    disableClose: false,
                    panelClass: 'staff-shift-check-in-out-dialog',
                    data: {
                        mode: 'checkin',
                        photoRequired: this.shift.check_in_photo
                    }
                });
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        try {
                            const res = await this.scheduleService.checkInShiftRole(roleStaffId, result);
                            role.message = res.role_message;
                            role.actions = [...res.actions]
                        } catch (e) {
                            this.displayError(e);
                        }
                    }
                });
                break;

            case Action.check_out:
                dialogRef = this.dialog.open(StaffShiftCheckInOutDialogComponent, {
                    disableClose: false,
                    panelClass: 'staff-shift-check-in-out-dialog',
                    data: {
                        mode: 'checkout',
                        photoRequired: this.shift.check_out_photo
                    }
                });
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        try {
                            const res = await this.scheduleService.checkOutShiftRole(roleStaffId, result);
                            role.message = res.role_message;
                            role.actions = [...res.actions]
                        } catch (e) {
                            this.displayError(e);
                        }
                    }
                });
                break;

            case Action.complete:
                dialogRef = this.dialog.open(StaffShiftCompleteDialogComponent, {
                    disableClose: false,
                    panelClass: 'staff-shift-complete-dialog',
                    data: {
                        roleStaffId: role.role_staff_id,
                        // action,
                        role
                    }
                });
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        const roleStaffId = role.role_staff_id;
                        try {
                            const res = await this.scheduleService.completeShiftRole(roleStaffId);
                            role.message = res.role_message;
                            role.actions = [...res.actions];
                        } catch (e) {
                            this.toastr.error(e.error.message);
                        }
                    }
                });
                break;

            case Action.expenses:

                break;

            case Action.invoice:
                // Open generating invoice tab
                tab = new Tab('New Invoice', 'generatePayrollTpl', 'staff/new-invoice', { from: this.shift.date });
                this.tabService.openTab(tab);
                break;

            case Action.view_invoice:

                break;

            case Action.view_pay:

                break;

            case Action.reports:

                break;

            case Action.uploads:

                break;

            default:
                break;
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
