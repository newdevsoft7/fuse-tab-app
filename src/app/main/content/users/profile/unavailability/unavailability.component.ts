import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../user.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddUnavailabilityDialogComponent } from './add-unavailability-dialog/add-unavailability-dialog.component';

@Component({
    selector: 'app-users-profile-unavailability',
    templateUrl: './unavailability.component.html',
    styleUrls: ['./unavailability.component.scss']
})
export class UsersProfileUnavailabilityComponent implements OnInit {

    @Input('userInfo') user;
    @Input() currentUser;

    unavailabilities: any[] = [];

    dialogRef: MatDialogRef<AddUnavailabilityDialogComponent>;

    WEEK = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private dialog: MatDialog,
    ) { }

    async ngOnInit() {
        try {
            this.unavailabilities = await this.userService.getUserAvailabilities(this.user.id);
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
    }

    openDialog() {
        this.dialogRef = this.dialog.open(AddUnavailabilityDialogComponent, {
            data: {
            },
            panelClass: 'add-unavailability-dialog'
        });

        this.dialogRef.afterClosed().subscribe(async (result) => {
            if (result !== false) {
                try {
                    const res = await this.userService.addUserAvailability(result);

                    const dates =
                        `${moment(res.data.ua_start).format('MM/DD/YYYY')} - ${moment(res.data.ua_end).format('MM/DD/YYYY')}`;

                    // tslint:disable-next-line:max-line-length
                    const recurring = res.data.weekday !== null ? `Every ${this.WEEK[res.data.weekday - 1]} ${moment(res.data.ua_start).format('h:mm a')} - ${moment(res.data.ua_end).format('h:mm a')}` : null;
                    const item = {
                        id: res.data.id,
                        dates,
                        recurring,
                        title: res.data.title
                    };

                    this.unavailabilities = [
                        ...this.unavailabilities,
                        item
                    ];
                    this.toastr.success(res.message);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    async delete(id) {
        try {
            const res = await this.userService.deleteUserAvailability(id);
            this.unavailabilities = this.unavailabilities.filter(v => v.id !== id);
            this.toastr.success(res.message);
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
            this.toastr.error(e.message);
        }
    }

}

function convertTime(date) {
    date = moment(date).format('h:mm a');
}
