import {
    Component, OnInit,
    ViewEncapsulation, Input,
    DoCheck, IterableDiffers,
    Output, EventEmitter
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../../../shared/services/custom-loading.service';

import * as _ from 'lodash';
import { FuseConfirmDialogComponent } from '../../../../../../../core/components/confirm-dialog/confirm-dialog.component';


@Component({
    selector: 'app-admin-shift-staff-applicants',
    templateUrl: './applicants.component.html',
    styleUrls: ['./applicants.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftStaffApplicantsComponent implements OnInit, DoCheck {

    _staffs;

    @Input()
    get staffs() {
        return this._staffs;
    }

    @Output() staffsChange = new EventEmitter();
    set staffs(staffs) {
        this._staffs = staffs;
        this.staffsChange.emit(staffs);
    }

    @Output() onStaffCountChanged = new EventEmitter();

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


    constructor(
        private loadingService: CustomLoadingService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        differs: IterableDiffers
    ) {
    }

    select(staff) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Really select this applicant?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                // TODO
                this.updateStaffCount();
            }
        });     
    }

    standby(staff) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Really place this applicant on standby?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                // TODO
                this.updateStaffCount();
            }
        });    
    }

    hiddenReject(staff) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Really hidden reject this applicant?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                // TODO
                this.updateStaffCount();
            }
        });
        
    }

    reject(staff) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Really reject this applicant?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.updateStaffCount();
            }
        });
    }

    private updateStaffCount() {
        this.onStaffCountChanged.next(true);
    }


    ngOnInit() {
        console.log(`applicants`);
    }

    ngDoCheck() {
    }


}
