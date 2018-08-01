import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EditTrackingDialogComponent } from './edit-tracking-dialog/edit-tracking-dialog.component';
import { ScheduleService } from '../../../schedule.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';

@Component({
    selector: 'app-edit-tracking',
    templateUrl: './edit-tracking.component.html',
    styleUrls: ['./edit-tracking.component.scss']
})
export class EditTrackingComponent implements OnInit, OnChanges {

    @Input() category;
    @Input() shift;
    @Input() data;
    currentUser: any;

    options;

    dialogRef: MatDialogRef<EditTrackingDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private scheduleService: ScheduleService,
        private tokenStorage: TokenStorage
    ) {
        this.currentUser = tokenStorage.getUser();
    }

    get isClient() {
        return this.currentUser.lvl === 'client';
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue) {
            if (this.data.tracking) {
                const category = this.data.tracking.find(v => v.id === this.category.id);
                this.options = category ? category.tracking_options : [];
            }
        }
    }

    openDialog() {
        if (this.isClient) { return; }
        this.dialogRef = this.dialog.open(EditTrackingDialogComponent, {
            data: {
                options: this.options,
                category: this.category,
            },
            panelClass: 'edit-tracking-dialog'
        });

        this.dialogRef.afterClosed().subscribe(async (options) => {
            if (options !== false) {
                try {
                    const res =
                        await this.scheduleService.setShiftTrackingOptions(this.shift.id, this.category.id, options);
                    this.category.options = options.map(option => this.options.find(o => o.id === option));
                } catch (e) {

                }
            }
        });
    }

}
